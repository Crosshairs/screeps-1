/**
 * Creeps are your units. Creeps can move, harvest energy, construct structures, attack another creeps, and perform other actions.
 */
interface Creep extends Owned
{
    id: string;
    
    room: Room;
    pos: RoomPosition;
    
    carry: { energy: number; power?: number };
    carryCapacity: number;
    fatigue: number;
    hits: number;
    hitsMax: number;
    memory: any;
    name: string;
    spawning: boolean;
    ticksToLive: number;
    
    /**
     * Build a structure at the target construction site using carried energy. Needs WORK and CARRY body parts. The target has to be within 3 squares range of the creep.
     */
    build(target: ConstructionSite): number;
    
    /**
     * Find the optimal path to the target within the same room and move to it. A shorthand to consequent calls of pos.findPathTo() and move() methods. If the target is in another room, then the corresponding exit will be used as a target. Needs the MOVE body part.
     */
    moveTo(target: RoomPosition|{pos: RoomPosition}): number;
    
    /**
     * Harvest energy from the source. Needs the WORK body part. If the creep has an empty CARRY body part, the harvested energy is put into it; otherwise it is dropped on the ground. The target has to be at an adjacent square to the creep.
     */
    harvest(target: Source): number;

    /**
     * Transfer resource from the creep to another object. The target has to be at adjacent square to the creep.
     */
    transfer(target: Creep | Spawn | Structure, resourceType: string, amount?: number): number;
}