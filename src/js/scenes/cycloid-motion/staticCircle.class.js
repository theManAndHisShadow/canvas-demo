import { BasicCircelBone } from "./basicCircle.class";

export class StaticCircleBone extends BasicCircelBone {
    /**
     * 
     * @param {object} param.parent - parent object of class instance
     * @param {number} param.cx - x pos of circle center
     * @param {number} param.cy - y pos of circle center
     * @param {number} param.radius - radius of circle center
     * @param {string} param.fillColor - color if circle fill
     * @param {string} param.borderColor - color of circle border line
     * @param {number} param.borderThickness - thickness of circle border
     * @param {number} param.type - type of circle (internal or external)
     * @param {boolean} param.drawCenterPoint - draw or not center point of circle
     * @param {boolean} param.drawRadiusLine - draw or not radius line of circle3
     * @param {CanvasRenderingContext2D} param.renderer - where the circle will be drawn
     */
    constructor({
        id = null, 
        type, 
        parent, 
        renderer, 
        cx, cy, radius, 
        borderColor, borderThickness, fillColor, 
        drawCenterPoint = false, drawRadiusLine = false
    }) {
        super(arguments[0]);
    }
}