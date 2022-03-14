const sumReduce = (pv, cv) => pv + cv;

/**
 * @author Jens H.
 */
export class DataValidation {
    private readonly n: number;
    private readonly t: number;
    private params: {a: number, b: number} ={a:0, b:0};
    private xData: number[] = [];
    private yData: number[] = [];

    /**
     * @param maxValues - Max Values used for calculation
     * @param t Max difference between calculation and value to test
     */
    constructor(maxValues: number, t: number) {
        this.n = maxValues;
        this.t = t;
    }

    private static cov(xData: number[], yData: number[]) {
        if (xData.length !== yData.length) throw new Error("Array Length don't Match");
        let avgX = xData.reduce(sumReduce, 0) / xData.length;
        let avgY = yData.reduce(sumReduce, 0) / yData.length;
        xData = xData.map(value => value - avgX)
        yData = yData.map(value => value - avgY)

        const combined = [xData, yData];
        const sumXY = combined.reduce((pv, cv) => cv[0]*cv[1], 0)

        return 1/xData.length * sumXY;
    }

    private calcLS() {
        const a = DataValidation.cov(this.xData, this.yData) / DataValidation.cov(this.xData, this.xData);
        const b = (this.yData.reduce(sumReduce, 0)  /  this.yData.length) - a * (this.xData.reduce(sumReduce, 0) / this.xData.length);
        this.params.a = a;
        this.params.b = b;
    }

    public addValue(value: number, calcLS = true) {
        if (this.xData.length >= this.n) {
            this.xData.shift();
            this.yData.shift();
        }
        this.xData.push(Date.now());
        this.yData.push(value);
        if (calcLS) this.calcLS();
    }

    private predicted(x: number) {
        return (this.params.a * x + this.params.b);
    }

    public checkValue(value: number) {
        const e = Math.pow(this.predicted(Date.now()) - value, 2);
        if (e <= this.t) return value
        return null;
    }
}
