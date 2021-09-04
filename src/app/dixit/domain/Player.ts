export default class Player {
    constructor(public readonly id: number,
                public name: string,
                public readonly color: string,
                public score: number = 0) {
    }
}