import { lstat, open, readFile, readdir } from 'fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'path';
import { pathToFileURL } from 'url';
import yaml from 'js-yaml';

const PROTOCOL_VERSION = 1;
const MANIFEST_SCHEMA_VERSION = 1;
const FRONTMATTER_LIMIT_BYTES = 16384;
const FRONTMATTER_CHUNK_BYTES = 1024;
const ROOT_FIELDS = new Set(['schema_version', 'name', 'description', 'selection']);
const SELECTION_FIELDS = new Set(['requirement', 'rules']);
const RULE_FIELDS = new Set(['id', 'match']);
const PRIMITIVE_OPERATORS = new Set(['path_glob', 'identifier', 'phrase', 'terms_any', 'terms_all']);
const INPUT_FIELDS = new Set(['protocol_version', 'task_text', 'task_paths', 'loaded_skills']);

function isRecord(value) { return typeof value === 'object' && value !== null && !Array.isArray(value); }

function sortStrings(values) { return [...values].sort((left, right) => left < right ? -1 : left > right ? 1 : 0); }

function normalizeText(value) {
    return value.normalize('NFKC').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function hasBoundedValue(text, value, identifier) {
    const tokenCharacters = identifier ? '\\p{L}\\p{N}_$' : '\\p{L}\\p{N}';
    return new RegExp(`(^|[^${tokenCharacters}])${escapeRegex(value)}(?=$|[^${tokenCharacters}])`, 'u').test(text);
}

function normalizeTaskPath(value, rootDir) {
    const absolutePath = isAbsolute(value) ? resolve(value) : resolve(rootDir, value);
    const relativePath = relative(rootDir, absolutePath);
    const pathInsideRoot = relativePath !== '..' && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath);
    const selectedPath = pathInsideRoot ? relativePath : value;
    const normalizedSegments = [];

    for (const segment of selectedPath.replace(/\\/g, '/').split('/')) {
        if (!segment || segment === '.') continue;
        if (segment === '..' && normalizedSegments.length > 0 && normalizedSegments[normalizedSegments.length - 1] !== '..') normalizedSegments.pop();
        else normalizedSegments.push(segment);
    }

    return normalizedSegments.join('/').toLowerCase();
}

function globToRegex(pattern) {
    let regex = '^';

    for (let index = 0; index < pattern.length; index++) {
        const character = pattern[index];

        if (character === '*' && pattern[index + 1] === '*') {
            if (pattern[index + 2] === '/') {
                regex += '(?:.*/)?';
                index += 2;
            } else {
                regex += '.*';
                index++;
            }
        } else if (character === '*') regex += '[^/]*';
        else if (character === '?') regex += '[^/]';
        else regex += escapeRegex(character);
    }

    return new RegExp(`${regex}$`, 'i');
}

function relativePosix(rootDir, filePath) { return relative(rootDir, filePath).replace(/\\/g, '/'); }

function validateExactFields(record, allowedFields, location, errors) {
    for (const field of Object.keys(record)) if (!allowedFields.has(field)) errors.push(`${location}: campo desconhecido "${field}"`);
}

function validateStringList(value, location, errors) {
    if (!Array.isArray(value) || value.length === 0) {
        errors.push(`${location}: deve ser uma lista não vazia`);
        return;
    }

    for (const item of value) if (typeof item !== 'string' || !item.trim()) errors.push(`${location}: todos os valores devem ser strings não vazias`);
}

function validateGlobPatterns(values, location, errors) {
    if (!Array.isArray(values)) return;
    for (const value of values) if (typeof value === 'string' && /[\[\]{}]/.test(value)) errors.push(`${location}: construção glob não suportada em "${value}"`);
}

function validatePrimitiveExpression(expression, location, errors) {
    if (!isRecord(expression)) {
        errors.push(`${location}: expressão deve ser um objeto`);
        return;
    }

    const fields = Object.keys(expression);

    if (fields.length !== 1) {
        errors.push(`${location}: deve possuir exatamente um operador`);
        return;
    }

    const operator = fields[0];

    if (!PRIMITIVE_OPERATORS.has(operator)) {
        errors.push(`${location}: operador desconhecido "${operator}"`);
        return;
    }

    validateStringList(expression[operator], `${location}.${operator}`, errors);
    if (operator === 'path_glob') validateGlobPatterns(expression[operator], `${location}.${operator}`, errors);
}

function validateMatchExpression(expression, location, errors) {
    if (!isRecord(expression)) {
        errors.push(`${location}: expressão deve ser um objeto`);
        return;
    }

    const fields = Object.keys(expression);

    if (fields.length !== 1) {
        errors.push(`${location}: deve possuir exatamente um operador ou combinador`);
        return;
    }

    const operator = fields[0];

    if (PRIMITIVE_OPERATORS.has(operator)) {
        validateStringList(expression[operator], `${location}.${operator}`, errors);
        if (operator === 'path_glob') validateGlobPatterns(expression[operator], `${location}.${operator}`, errors);
        return;
    }

    if (operator !== 'all') {
        errors.push(`${location}: operador ou combinador desconhecido "${operator}"`);
        return;
    }

    const expressions = expression.all;

    if (!Array.isArray(expressions) || expressions.length === 0) {
        errors.push(`${location}.all: deve ser uma lista não vazia`);
        return;
    }

    for (let index = 0; index < expressions.length; index++) {
        const child = expressions[index];
        const childLocation = `${location}.all[${index}]`;

        if (!isRecord(child)) {
            errors.push(`${childLocation}: expressão deve ser um objeto`);
            continue;
        }

        const childFields = Object.keys(child);

        if (childFields.length !== 1) {
            errors.push(`${childLocation}: deve possuir exatamente um operador ou combinador not`);
            continue;
        }

        if (childFields[0] === 'not') validatePrimitiveExpression(child.not, `${childLocation}.not`, errors);
        else validatePrimitiveExpression(child, childLocation, errors);
    }
}

export async function readSkillFrontmatter(skillPath) {
    const handle = await open(skillPath, 'r');
    const decoder = new TextDecoder('utf8');
    const buffer = Buffer.alloc(FRONTMATTER_CHUNK_BYTES);
    let content = '';
    let bytesReadTotal = 0;

    try {
        while (bytesReadTotal < FRONTMATTER_LIMIT_BYTES) {
            const requestedBytes = Math.min(FRONTMATTER_CHUNK_BYTES, FRONTMATTER_LIMIT_BYTES - bytesReadTotal);
            const result = await handle.read(buffer, 0, requestedBytes, null);

            if (result.bytesRead === 0) break;

            bytesReadTotal += result.bytesRead;
            content += decoder.decode(buffer.subarray(0, result.bytesRead), { stream: true });

            const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

            if (!match) continue;

            const metadata = yaml.load(match[1]);

            if (!isRecord(metadata)) throw new Error('frontmatter deve ser um objeto YAML');

            return { metadata, bytes_read: bytesReadTotal };
        }
    } finally {
        await handle.close();
    }

    throw new Error(`frontmatter não encontrado nos primeiros ${FRONTMATTER_LIMIT_BYTES} bytes`);
}

async function readManifestCandidate(rootDir, folderName, manifestPath) {
    const errors = [];
    const skillDirectory = dirname(manifestPath);
    const skillPath = join(skillDirectory, 'SKILL.md');
    let manifest;
    let frontmatter;

    try {
        manifest = yaml.load(await readFile(manifestPath, 'utf8'));
    } catch (error) {
        errors.push(`YAML inválido: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        frontmatter = (await readSkillFrontmatter(skillPath)).metadata;
    } catch (error) {
        errors.push(`SKILL.md inválido: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (!isRecord(manifest)) errors.push('manifesto deve ser um objeto YAML');
    else {
        validateExactFields(manifest, ROOT_FIELDS, 'manifesto', errors);

        if (manifest.schema_version !== MANIFEST_SCHEMA_VERSION) errors.push(`schema_version não suportado: ${String(manifest.schema_version)}`);
        if (typeof manifest.name !== 'string' || !manifest.name) errors.push('name deve ser uma string não vazia');
        else if (manifest.name !== folderName) errors.push(`name "${manifest.name}" diverge da pasta "${folderName}"`);
        if (typeof manifest.description !== 'string' || !manifest.description) errors.push('description deve ser uma string não vazia');

        if (!isRecord(manifest.selection)) errors.push('selection deve ser um objeto');
        else {
            validateExactFields(manifest.selection, SELECTION_FIELDS, 'selection', errors);

            if (manifest.selection.requirement !== 'required') errors.push(`selection.requirement não suportado: ${String(manifest.selection.requirement)}`);

            if (!Array.isArray(manifest.selection.rules) || manifest.selection.rules.length === 0) errors.push('selection.rules deve ser uma lista não vazia');
            else {
                const ruleIds = new Set();

                for (let index = 0; index < manifest.selection.rules.length; index++) {
                    const rule = manifest.selection.rules[index];
                    const location = `selection.rules[${index}]`;

                    if (!isRecord(rule)) {
                        errors.push(`${location}: regra deve ser um objeto`);
                        continue;
                    }

                    validateExactFields(rule, RULE_FIELDS, location, errors);

                    if (typeof rule.id !== 'string' || !rule.id) errors.push(`${location}.id deve ser uma string não vazia`);
                    else if (ruleIds.has(rule.id)) errors.push(`${location}.id duplicado: "${rule.id}"`);
                    else ruleIds.add(rule.id);

                    validateMatchExpression(rule.match, `${location}.match`, errors);
                }
            }
        }
    }

    if (isRecord(manifest) && isRecord(frontmatter)) {
        if (manifest.name !== frontmatter.name) errors.push('name diverge do frontmatter do SKILL.md');
        if (manifest.description !== frontmatter.description) errors.push('description diverge do frontmatter do SKILL.md');
    }

    return { folder_name: folderName, skill_directory: relativePosix(rootDir, skillDirectory), manifest_path: relativePosix(rootDir, manifestPath), skill_md_path: relativePosix(rootDir, skillPath), manifest, errors };
}

async function collectManifestPaths(rootDir, directoryPath, manifestPaths, discoveryErrors) {
    let entries;

    try {
        entries = await readdir(directoryPath, { withFileTypes: true });
    } catch (error) {
        discoveryErrors.push({ manifest_path: relativePosix(rootDir, directoryPath), errors: [`diretório inacessível: ${error instanceof Error ? error.message : String(error)}`] });
        return;
    }

    for (const entry of entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
        const entryPath = join(directoryPath, entry.name);
        let entryStat;

        try {
            entryStat = await lstat(entryPath);
        } catch (error) {
            discoveryErrors.push({ manifest_path: relativePosix(rootDir, entryPath), errors: [`caminho inacessível: ${error instanceof Error ? error.message : String(error)}`] });
            continue;
        }

        if (entryStat.isSymbolicLink()) continue;

        if (entryStat.isDirectory()) {
            await collectManifestPaths(rootDir, entryPath, manifestPaths, discoveryErrors);
            continue;
        }

        if (entry.name === 'skill.yaml' && entryStat.isFile()) manifestPaths.push(entryPath);
    }
}

async function discoverManifestCandidates(rootDir) {
    const skillsRoot = join(rootDir, '.agents', 'skills');
    const discoveryErrors = [];
    const manifestPaths = [];
    await collectManifestPaths(rootDir, skillsRoot, manifestPaths, discoveryErrors);
    manifestPaths.sort((left, right) => {
        const leftPath = relativePosix(rootDir, left);
        const rightPath = relativePosix(rootDir, right);
        return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0;
    });
    const candidates = [];

    for (const manifestPath of manifestPaths) candidates.push(await readManifestCandidate(rootDir, basename(dirname(manifestPath)), manifestPath));

    for (const candidate of candidates) {
        const parentSkill = candidates.find((otherCandidate) => otherCandidate !== candidate && candidate.skill_directory.startsWith(`${otherCandidate.skill_directory}/`));
        if (parentSkill) candidate.errors.push(`skill aninhada dentro da skill "${parentSkill.folder_name}"`);
    }

    const candidatesByName = new Map();

    for (const candidate of candidates) {
        if (!isRecord(candidate.manifest) || typeof candidate.manifest.name !== 'string') continue;
        const namedCandidates = candidatesByName.get(candidate.manifest.name) || [];
        namedCandidates.push(candidate);
        candidatesByName.set(candidate.manifest.name, namedCandidates);
    }

    for (const [name, namedCandidates] of candidatesByName) {
        if (namedCandidates.length < 2) continue;
        for (const candidate of namedCandidates) candidate.errors.push(`name de skill duplicado: "${name}"`);
    }

    return { candidates, discoveryErrors };
}

function primitiveEvidence(operator, expected, source, matched) { return { operator, expected, source, matched }; }

function evaluatePrimitive(expression, context) {
    const [operator, values] = Object.entries(expression)[0];
    const evidence = [];

    if (operator === 'path_glob') {
        for (const expected of values) {
            const regex = globToRegex(expected.replace(/\\/g, '/'));
            for (const taskPath of context.taskPaths) if (regex.test(taskPath)) evidence.push(primitiveEvidence(operator, expected, 'task_path', taskPath));
        }

        return { matched: evidence.length > 0, evidence };
    }

    if (operator === 'identifier') {
        for (const expected of values) if (hasBoundedValue(context.taskText, expected, true)) evidence.push(primitiveEvidence(operator, expected, 'task_text', expected));
        return { matched: evidence.length > 0, evidence };
    }

    const normalizedValues = values.map((value) => ({ expected: value, normalized: normalizeText(value) }));

    if (operator === 'terms_all') {
        for (const value of normalizedValues) {
            if (!hasBoundedValue(context.normalizedTaskText, value.normalized, false)) return { matched: false, evidence: [] };
            evidence.push(primitiveEvidence(operator, value.expected, 'task_text', value.normalized));
        }

        return { matched: true, evidence };
    }

    for (const value of normalizedValues) if (hasBoundedValue(context.normalizedTaskText, value.normalized, false)) evidence.push(primitiveEvidence(operator, value.expected, 'task_text', value.normalized));
    return { matched: evidence.length > 0, evidence };
}

function evaluateMatch(expression, context) {
    const [operator, value] = Object.entries(expression)[0];

    if (PRIMITIVE_OPERATORS.has(operator)) return evaluatePrimitive(expression, context);

    const childResults = [];

    for (const child of value) {
        if (Object.keys(child)[0] === 'not') {
            const innerResult = evaluatePrimitive(child.not, context);
            childResults.push({ matched: !innerResult.matched, evidence: [] });
        } else childResults.push(evaluatePrimitive(child, context));
    }

    if (childResults.some((result) => !result.matched)) return { matched: false, evidence: [] };
    return { matched: true, evidence: childResults.flatMap((result) => result.evidence) };
}

export function validateSelectorInput(input) {
    const errors = [];

    if (!isRecord(input)) return ['entrada deve ser um objeto JSON'];

    validateExactFields(input, INPUT_FIELDS, 'entrada', errors);

    if (input.protocol_version !== PROTOCOL_VERSION) errors.push(`protocol_version não suportado: ${String(input.protocol_version)}`);
    if (typeof input.task_text !== 'string') errors.push('task_text deve ser uma string');

    for (const field of ['task_paths', 'loaded_skills']) {
        const value = input[field];
        if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item)) errors.push(`${field} deve ser uma lista de strings não vazias`);
        else if (new Set(value).size !== value.length) errors.push(`${field} não pode conter valores duplicados`);
    }

    return errors;
}

export async function selectSkills({ rootDir, input }) {
    const inputErrors = validateSelectorInput(input);

    if (inputErrors.length > 0) {
        const error = new Error('entrada inválida');
        error.input_errors = inputErrors;
        throw error;
    }

    const absoluteRoot = resolve(rootDir);
    const discovery = await discoverManifestCandidates(absoluteRoot);
    const skillsFound = discovery.candidates.map((candidate) => candidate.folder_name);
    const invalidManifests = [...discovery.discoveryErrors, ...discovery.candidates.filter((candidate) => candidate.errors.length > 0).map((candidate) => ({ manifest_path: candidate.manifest_path, errors: candidate.errors }))];
    const loadedSkills = new Set(input.loaded_skills);
    const context = {
        taskText: input.task_text,
        normalizedTaskText: normalizeText(input.task_text),
        taskPaths: sortStrings(input.task_paths.map((taskPath) => normalizeTaskPath(taskPath, absoluteRoot)))
    };
    const skillsSelected = [];

    for (const candidate of discovery.candidates) {
        if (candidate.errors.length > 0) continue;

        const matchedRules = [];

        for (const rule of candidate.manifest.selection.rules) {
            const result = evaluateMatch(rule.match, context);
            if (result.matched) matchedRules.push({ rule_id: rule.id, evidence: result.evidence.map((evidence) => ({ skill: candidate.manifest.name, rule_id: rule.id, ...evidence })) });
        }

        if (matchedRules.length === 0) continue;

        skillsSelected.push({ name: candidate.manifest.name, manifest_path: candidate.manifest_path, skill_md_path: candidate.skill_md_path, matched_rules: matchedRules });
    }

    const selectedNames = skillsSelected.map((skill) => skill.name);

    return {
        protocol_version: PROTOCOL_VERSION,
        discovery_complete: invalidManifests.length === 0,
        skills_found: skillsFound,
        skills_selected: skillsSelected,
        skills_to_load: selectedNames.filter((name) => !loadedSkills.has(name)),
        skills_already_loaded: selectedNames.filter((name) => loadedSkills.has(name)),
        invalid_manifests: invalidManifests
    };
}

function parseCliArguments(argumentsList) {
    const options = { inputBase64: null, inputPath: null, pretty: false, rootDir: process.cwd() };

    // Algumas versões do npm no Windows PowerShell removem --input-base64 e repassam somente seu valor.
    if (argumentsList.length === 1 && !argumentsList[0].startsWith('--')) {
        options.inputBase64 = argumentsList[0];
        return options;
    }

    for (let index = 0; index < argumentsList.length; index++) {
        const argument = argumentsList[index];

        if (argument === '--pretty') options.pretty = true;
        else if (argument === '--input' || argument === '--input-base64' || argument === '--root') {
            const value = argumentsList[index + 1];
            if (!value) throw new Error(`${argument} exige um valor`);
            if (argument === '--input') options.inputPath = resolve(process.cwd(), value);
            else if (argument === '--input-base64') options.inputBase64 = value;
            else options.rootDir = resolve(process.cwd(), value);
            index++;
        } else throw new Error(`argumento desconhecido: ${argument}`);
    }

    if (options.inputPath && options.inputBase64) throw new Error('--input e --input-base64 não podem ser usados juntos');

    return options;
}

async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
}

function decodeBase64Utf8(value) {
    const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!validBase64.test(value)) throw new Error('--input-base64 inválido');

    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(value, 'base64'));
    } catch {
        throw new Error('--input-base64 não contém UTF-8 válido');
    }
}

function emptyOutput(inputErrors) {
    return { protocol_version: PROTOCOL_VERSION, discovery_complete: false, skills_found: [], skills_selected: [], skills_to_load: [], skills_already_loaded: [], invalid_manifests: [], input_errors: inputErrors };
}

export async function runCli(argumentsList = process.argv.slice(2)) {
    let options;

    try {
        options = parseCliArguments(argumentsList);
        const inputContent = options.inputBase64 ? decodeBase64Utf8(options.inputBase64) : options.inputPath ? await readFile(options.inputPath, 'utf8') : await readStdin();
        const input = JSON.parse(inputContent);
        const output = await selectSkills({ rootDir: options.rootDir, input });
        process.stdout.write(`${JSON.stringify(output, null, options.pretty ? 4 : 0)}\n`);
        return output.discovery_complete ? 0 : 3;
    } catch (error) {
        const inputErrors = Array.isArray(error?.input_errors) ? error.input_errors : [error instanceof Error ? error.message : String(error)];
        process.stdout.write(`${JSON.stringify(emptyOutput(inputErrors), null, options?.pretty ? 4 : 0)}\n`);
        return 2;
    }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';

if (import.meta.url === invokedPath) process.exitCode = await runCli();
