import * as strategy from './strategy';
import * as actor from './actor';
import * as util from './util';
import _ = require('lodash');

let home = Game.spawns['Spawn1'];

function assignWorkers(assignments: string[])
{
    let workers = _.filter(Game.creeps, util.wasOriginally(['upgrade', 'build', 'repair']))
    
    if (workers.length != assignments.length)
    {
        console.log("assign: incorrect work item count");
        console.log("workers: " + _.map(workers, util.originalRole));
        console.log("assignments: " + assignments);
        return;
    }
    
    for (let i = 0; i < assignments.length; i++)
    {
        actor.reset(workers[i], assignments[i]);
    }
}

function spawnCreep(spawner: Spawn, spec: Spec)
{
    let result = spawner.createCreep(spec.body, undefined, spec.memory);
            
    if (_.isString(result))
    {
        console.log("spawn: creating " + spec.memory.act + ' "' + result + '"');
    }
    else
    {
        switch (result)
        {
            case ERR_NOT_ENOUGH_ENERGY:
                console.log('spawn: not enough energy');
                break;

            case ERR_BUSY:
                console.log('spawn: already busy');
                break;

            default:
                console.log('spawn: unexpected error ' + result);
        }              
    }
}

function spawnCreeps(specs: Spec[])
{
    let spawners = [home];
    let usedSpawners: Spawn[] = [];
    
    _.forEach(specs, spec =>
    {
        let availableEnergy = util.calculateAvailableEnergy(home.room);
        if (spec.cost > availableEnergy) 
        {
            console.log('spawn goal cost too high');
        }
        
        let spawner = _.head(_.filter(spawners, s => _.indexOf(usedSpawners, s)==-1 && s.canCreateCreep(spec.body) == OK));
        if (spawner) spawnCreep(spawner, spec);
    });
}

function performRoles()
{
    for (let name in Game.creeps)
    {
        let creep = Game.creeps[name];
        if (!creep.spawning) actor.act(creep);
    }
}

export function loop() 
{
    let plan = strategy.plan(home.room);
    
    assignWorkers(plan.workers);
    spawnCreeps(plan.spawns);
    performRoles();
}