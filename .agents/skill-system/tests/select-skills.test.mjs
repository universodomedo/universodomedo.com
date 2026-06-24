import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { readSkillFrontmatter, selectSkills } from '../selector/select-skills.mjs';

const TEST_ROOT = fileURLToPath(new URL('.', import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_ROOT, '../../..');
const COORDENADAS_SKILL = 'coordenadas-ponteiro-conteiner-escalavel';
const LAYOUT_SKILL = 'navegacao-layout-contextualizado';
const CONTEINER_ESCALAVEL_PATH = 'src/componentes/ElementosVisuais/ConteinerEscalavel/ConteinerEscalavel.tsx';

function selectorInput(taskText, taskPaths = [], loadedSkills = []) {
    return { protocol_version: 1, task_text: taskText, task_paths: taskPaths, loaded_skills: loadedSkills };
}

function selectedSkill(result, skillName) { return result.skills_selected.find((skill) => skill.name === skillName); }

function matchedRuleIds(result, skillName) {
    const skill = selectedSkill(result, skillName);
    return skill ? skill.matched_rules.map((rule) => rule.rule_id) : [];
}

function baseManifest() {
    return { schema_version: 1, name: 'fixture-temporaria', description: 'Fixture temporária para validação estrutural.', selection: { requirement: 'required', rules: [{ id: 'sempre', match: { terms_any: ['fixture'] } }] } };
}

async function writeTemporarySkill(rootDir, relativeDirectory, manifest, frontmatterName = manifest.name, frontmatterDescription = manifest.description) {
    const skillDir = join(rootDir, '.agents', 'skills', relativeDirectory);
    await mkdir(skillDir, { recursive: true });
    await writeFile(join(skillDir, 'skill.yaml'), JSON.stringify(manifest, null, 4), 'utf8');
    await writeFile(join(skillDir, 'SKILL.md'), `---\nname: ${frontmatterName}\ndescription: ${frontmatterDescription}\n---\n\n# Fixture\n`, 'utf8');
    return skillDir;
}

test('descoberta completa no repositório e encontra a skill de coordenadas', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Tarefa neutra') });
    assert.equal(result.discovery_complete, true);
    assert.deepEqual(result.invalid_manifests, []);
    assert.ok(result.skills_found.includes(COORDENADAS_SKILL));
});

test('seleciona a skill de coordenadas por identificador de API de ponteiro', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Implementar arraste no canvas SVG: o cursor descola, preciso usar getScreenCTM para mapear as coordenadas do ponteiro.') });
    assert.equal(result.discovery_complete, true);
    assert.ok(selectedSkill(result, COORDENADAS_SKILL));
    assert.ok(matchedRuleIds(result, COORDENADAS_SKILL).includes('apis-de-coordenada-de-ponteiro'));
});

test('seleciona a skill de coordenadas por termos de interação de canvas', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Criar uma área de seleção arrastando o mouse e ajustar a posição das coordenadas no zoom.') });
    assert.ok(selectedSkill(result, COORDENADAS_SKILL));
    assert.ok(matchedRuleIds(result, COORDENADAS_SKILL).includes('interacao-de-canvas-ou-arraste'));
});

test('seleciona a skill de coordenadas pelo caminho do ConteinerEscalavel', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Ajustar o componente.', [CONTEINER_ESCALAVEL_PATH]) });
    assert.ok(selectedSkill(result, COORDENADAS_SKILL));
    assert.ok(matchedRuleIds(result, COORDENADAS_SKILL).includes('arquivo-conteiner-escalavel'));
});

test('não seleciona a skill de coordenadas em tarefa neutra', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Atualizar a documentação do README do projeto.') });
    assert.equal(result.discovery_complete, true);
    assert.equal(selectedSkill(result, COORDENADAS_SKILL), undefined);
});

test('loaded_skills evita recarregar a skill de coordenadas', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Corrigir coordenadas do ponteiro com getScreenCTM no arraste.', [], [COORDENADAS_SKILL]) });
    assert.deepEqual(result.skills_to_load, []);
    assert.ok(result.skills_already_loaded.includes(COORDENADAS_SKILL));
});

test('descoberta encontra a skill de navegacao contextual', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Tarefa neutra') });
    assert.equal(result.discovery_complete, true);
    assert.deepEqual(result.invalid_manifests, []);
    assert.ok(result.skills_found.includes(LAYOUT_SKILL));
});

test('seleciona a skill de navegacao contextual pelo uso do hook', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Estou usando useConfigurarLayoutContextualizado para ajustar o subtitulo da subpagina de edicao.') });
    assert.equal(result.discovery_complete, true);
    assert.ok(selectedSkill(result, LAYOUT_SKILL));
    assert.ok(matchedRuleIds(result, LAYOUT_SKILL).includes('uso-do-hook-layout-contextualizado'));
});

test('seleciona a skill de navegacao contextual pelo caminho do hook', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Ajustar o hook de layout.', ['src/redux/hooks/useLayoutContextualizado.ts']) });
    assert.ok(selectedSkill(result, LAYOUT_SKILL));
    assert.ok(matchedRuleIds(result, LAYOUT_SKILL).includes('arquivos-do-layout-contextualizado'));
});

test('seleciona a skill de navegacao contextual por termos', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Preciso configurar a navegação contextual e definir um bom subtitulo para a subpagina.') });
    assert.ok(selectedSkill(result, LAYOUT_SKILL));
    assert.ok(matchedRuleIds(result, LAYOUT_SKILL).includes('termos-de-navegacao-contextual'));
});

test('não seleciona a skill de navegacao contextual em tarefa neutra', async () => {
    const result = await selectSkills({ rootDir: REPOSITORY_ROOT, input: selectorInput('Atualizar a documentação do README do projeto.') });
    assert.equal(result.discovery_complete, true);
    assert.equal(selectedSkill(result, LAYOUT_SKILL), undefined);
});

test('manifesto com schema_version não suportado torna a descoberta incompleta', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'udm-skill-schema-'));
    const manifest = baseManifest();
    manifest.schema_version = 2;

    try {
        await writeTemporarySkill(rootDir, join('ui', manifest.name), manifest);
        const result = await selectSkills({ rootDir, input: selectorInput('Tarefa neutra') });
        assert.equal(result.discovery_complete, false);
        assert.ok(result.invalid_manifests.some((invalid) => invalid.errors.some((error) => error.includes('schema_version não suportado'))));
    } finally {
        await rm(rootDir, { recursive: true, force: true });
    }
});

test('skill aninhada dentro de outra skill invalida a descoberta', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'udm-skill-nested-'));
    const parent = baseManifest();
    parent.name = 'skill-pai';
    const child = baseManifest();
    child.name = 'skill-filha';

    try {
        await writeTemporarySkill(rootDir, join('ui', parent.name), parent);
        await writeTemporarySkill(rootDir, join('ui', parent.name, child.name), child);
        const result = await selectSkills({ rootDir, input: selectorInput('Tarefa neutra') });
        assert.equal(result.discovery_complete, false);
        assert.ok(result.invalid_manifests.some((invalid) => invalid.errors.some((error) => error.includes('skill aninhada'))));
    } finally {
        await rm(rootDir, { recursive: true, force: true });
    }
});

test('lê somente o frontmatter necessário do SKILL.md', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'udm-skill-frontmatter-'));
    const skillPath = join(rootDir, 'SKILL.md');
    const corpo = 'CORPO_NAO_DEVE_SER_CARREGADO\n'.repeat(5000);
    await writeFile(skillPath, `---\nname: fixture\ndescription: Fixture de frontmatter.\n---\n${corpo}`, 'utf8');

    try {
        const result = await readSkillFrontmatter(skillPath);
        const fileStat = await stat(skillPath);
        assert.equal(result.metadata.name, 'fixture');
        assert.ok(result.bytes_read < fileStat.size);
        assert.ok(result.bytes_read <= 1024);
    } finally {
        await rm(rootDir, { recursive: true, force: true });
    }
});

test('npm run --silent skills:select seleciona a skill de coordenadas via stdin', () => {
    const input = selectorInput('Corrigir o offset do cursor no arraste do canvas usando getScreenCTM.');
    const execution = spawnSync('npm run --silent skills:select', { cwd: REPOSITORY_ROOT, input: JSON.stringify(input), encoding: 'utf8', shell: true });
    assert.equal(execution.error, undefined);
    const output = JSON.parse(execution.stdout);
    assert.equal(execution.status, 0);
    assert.ok(output.skills_found.includes(COORDENADAS_SKILL));
    assert.ok(output.skills_selected.some((skill) => skill.name === COORDENADAS_SKILL));
});
