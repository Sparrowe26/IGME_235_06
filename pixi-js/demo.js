

class Triangle extends PIXI.Graphics {
    constructor(coords, color){
        super();
        this.coords = coords;
        this.color = color;

        this.beginFill(color);
        //drawing stuff
        this.drawPolygon(coords.flat());
        this.endFill();

        const newCoords = [
            [coords[0][0]/2, coords[0][1]/2],
            [coords[1][0]/2, coords[1][1]/2],
            [coords[2][0]/2, coords[2][1]/2]
        ]

        if(Math.abs(newCoords[0][0] - newCoords[1][0]) > 1){
            const newTriangle = new Triangle(newCoords, color/2);
            this.addChild(newTriangle);
        }
    }
}