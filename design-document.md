<!-- It is a homework requirement to write this design document -->

# Design Document

A WebGL 3D world for user to walk around

## Goal

This design is to create 3D scene allow user to walk around, which contains several objects with animation.

User can move around the world by type some keys, users can move or turn around to view the objects.

| key | action        |
| :-: | :------------ |
|  W  | move forward  |
|  S  | move backward |
|  A  | truck left    |
|  D  | truck right   |
|  I  | pedestal up   |
|  K  | pedestal down |
|  J  | rotate left   |
|  I  | rotate right  |

## Problems

- When user moves, the camera need to update the location and direction, and the sense will be different for user to see.
- There are move than one objects, with different shape/position/color/animation
- There will be many reuseable codes that should not be written more than once
- There are animation for objects to update the canvas, while there is user actions to update the canvas.

## Approaches

- A class `DirectedPoint` is designed, to record location and direction of a subject, with methods to move or rotate itself. This can generate the camera matrix with the help of `gl-matrix` library.
- In this app, all objects can share the same shader. So all objects can be put into one buffer and sent to the shader program.
- A helper class is designed for general WebGL work, which is intended to be reuseable between different WebGL projects.
- All objects are designed to be described by some common properties, so that they can be handle as "objects" of a class.

  Following is the class of object

  |     property     |              type              | description                                   |
  | :--------------: | :----------------------------: | :-------------------------------------------- |
  |     vertices     |         `Float32Array`         | vertex position of each point                 |
  |     normals      |         `Float32Array`         | normal vector of each point                   |
  |     indices      |         `Uint16Array`          | index of point for WebGL to draw element      |
  | modelViewMatrix  |          `mat4.mat4`           | model view matrix                             |
  | modelWorldMatrix |          `mat4.mat4`           | model view to world view matrix               |
  |  materialColor   |           `number[]`           | material color of object                      |
  |    updateFunc    | `function(self, number): void` | a function to update the model given the time |

- The animation is driven by `requestAnimationFrame` function. When the function is called by browser runtime, all objects will be update by calling `updateFunc` to update some properties. And then the WebGL begin to render the canvas.
- Any user move will only update the properties of camera only, with no rendering until next `requestAnimationFrame` call.

## Results

A canvas is implemented and user can use keyboard to walk around. Some extra keys are added for convenience.

## To Improve

So far, all objects share same shader program. If additional object need a different shader, some code cannot be reused.
