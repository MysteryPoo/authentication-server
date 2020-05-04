
export class Singleton {

    public static instance : Singleton;

    protected constructor() {

    }

    public static GetInstance<T>() : T {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance as T;
    }
}
