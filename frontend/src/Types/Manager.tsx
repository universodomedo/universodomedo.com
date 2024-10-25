export class Singleton<T extends object> {
    private static readonly instanceSymbol = Symbol('SingletonInstance');

    protected constructor() {}

    public static getInstance<T extends object>(): T {
        const instance = (this as any)[this.instanceSymbol];
        if (!instance) {
            (this as any)[this.instanceSymbol] = new this();
        }
        
        return instance as T;
    }
}
  
export default Singleton;  