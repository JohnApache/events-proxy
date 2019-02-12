declare class EventsProxy {
    setProxyLoopSplit(splitValue: string): void

    before(event: string, callback?: (data: any) => void): void
    before(event: string[], callback?: (data: any) => void): Function
    before(event: object): void

    after(event: string, callback?: (data: any) => void): void
    after(event: string[], callback?: (data: any) => void): Function
    after(event: object): void

    register(event: string, callback?: (data: any) => void): Function
    register(event: string[], callback?: (data: any) => void): Function
    register(event: object): void

    subscribe(event: string, callback?: (data: any) => void): Function
    subscribe(event: string[], callback?: (data: any) => void): Function
    subscribe(event: object): void

    bind(event: string, callback?: (data: any) => void): Function
    bind(event: string[], callback?: (data: any) => void): Function
    bind(event: object): void

    on(event: string, callback?: (data: any) => void): Function
    on(event: string[], callback?: (data: any) => void): Function
    on(event: object): void
    
    once(event: string, callback?: (data: any) => void): Function
    once(event: string[], callback?: (data: any) => void): Function
    once(event: object): void

    bindNTimes(event: string, callback: (data: any) => void, times: number): Function
    bindNTimes(event: string[], callback?: (data: any) => void): Function
    bindNTimes(event: object): void

    wait(event: string, callback: (data: any) => void, waitCount: number): Function
    wait(event: string[], callback?: (data: any) => void): Function
    wait(event: object): void

    unregister(event: string, callback: Function, waitCount?: number): void
    unsubscribe(event: string, callback: Function, waitCount?: number): void
    unbind(event: string, callback: Function, waitCount?: number): void
    off(event: string, callback: Function, waitCount?: number): void

    emit(event: string, data?: any): void 
    done(event: string, data?: any): void 
    
	async<T>(event: string): Promise<T>
}

declare function createEventsProxy (event?: string, callback?: Function): EventsProxy

export default createEventsProxy;