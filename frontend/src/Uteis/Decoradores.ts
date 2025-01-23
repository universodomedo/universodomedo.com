function LogExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log('antes');
        const result = originalMethod.apply(this, args);
        console.log('depois');
        return result;
    };

    return descriptor;
}