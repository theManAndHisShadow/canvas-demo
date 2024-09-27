/**
 * Base class for rendering. Contains the basis for the structure of other classes.
 */
export class PlanePrimitive {
    constructor(renderer){
        // N.B.: This property is null until it is manually configured during 'the add to context' step.
        this.renderer = renderer || null;

        this.parent = null;
    }
}