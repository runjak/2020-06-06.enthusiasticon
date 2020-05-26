import bpy
import json
import math
import mathutils

cubeTemplate = bpy.data.collections['cube-template']
cubeletSize = 1.02
cubeSize = 3 * cubeletSize


def currentKeyframe():
    return bpy.data.scenes['Scene'].frame_current


def setKeyframe(frame):
    return bpy.data.scenes['Scene'].frame_set(frame)


def keyCubelet(cubelet):
    cubelet.keyframe_insert(data_path='location', frame=currentKeyframe())
    cubelet.keyframe_insert(
        data_path='rotation_quaternion', frame=currentKeyframe())


def keyCubelets(cubelets):
    for cubelet in cubelets:
        keyCubelet(cubelet)


def newCube(name, translate):
    translate = mathutils.Vector(translate)
    cube = bpy.data.collections.new(name)

    for cubeletTemplate in cubeTemplate.all_objects:
        cubelet = bpy.data.objects.new(
            cubeletTemplate.name, cubeletTemplate.data)
        cubelet.location = translate + cubeletTemplate.location
        cubelet.rotation_mode = cubeletTemplate.rotation_mode
        cube.objects.link(cubelet)

    bpy.context.scene.collection.children.link(cube)
    return cube


def cubeGrid(name, width, height):
    for x in range(width):
        for y in range(height):
            newCube('cube', (cubeSize * x, cubeSize * y, 0))


def exampleVector(cubelet):
    return cubelet.matrix_world @ cubelet.data.vertices[0].co


def cubeletsBySide(cube, side):
    dimensionsBySide = {'U': 2, 'D': 2, 'F': 1, 'B': 1, 'R': 0, 'L': 0}
    revertBySide = {'U': True, 'D': False,
                    'F': True, 'B': False, 'R': False, 'L': True}
    dimension = dimensionsBySide[side]
    return sorted(
        list(cube.all_objects.values()),
        key=lambda c: exampleVector(c)[dimension],
        reverse=revertBySide[side])[:9]


def sidesDemo():
    pflaces = [((0, 0, -cubeSize), 'U'), ((0, 0, cubeSize), 'D'), ((cubeSize, 0, 0), 'R'),
               ((-cubeSize, 0, 0), 'L'), ((0, -cubeSize, 0), 'F'), ((0, cubeSize, 0), 'B')]
    for place, face in pflaces:
        currentCube = newCube('cube', place)
        selection = cubeletsBySide(currentCube, face)
        for s in selection:
            bpy.data.objects.remove(s)


def rotateQuaternion(cubelets, axis, angle):
    vecByAxis = {'X': (1, 0, 0), 'Y': (0, 1, 0), 'Z': (0, 0, 1)}
    qDelta = mathutils.Quaternion(vecByAxis[axis], angle)
    for cubelet in cubelets:
        cubelet.rotation_quaternion = qDelta @ cubelet.rotation_quaternion


def rotateSide(cube, side, angle):
    axisBySide = {'U': 'Z', 'D': 'Z', 'F': 'Y', 'B': 'Y', 'R': 'X', 'L': 'X'}
    rotateQuaternion(cubeletsBySide(cube, side), axisBySide[side], angle)


def rotateCube(cube, axis, angle):
    rotateQuaternion(cube.all_objects, axis, angle)


rotations = {
    # orienting the cube
    "X": lambda cube: rotateCube(cube, 'X', math.pi / 2),
    "X'": lambda cube: rotateCube(cube, 'X', -math.pi / 2),
    "Y": lambda cube: rotateCube(cube, 'Y', math.pi / 2),
    "Y'": lambda cube: rotateCube(cube, 'Y', -math.pi / 2),
    "Z": lambda cube: rotateCube(cube, 'Z', math.pi / 2),
    "Z'": lambda cube: rotateCube(cube, 'Z', -math.pi / 2),
    # twisting sides
    "U": lambda cube: rotateSide(cube, 'U', -math.pi / 2),
    "U'": lambda cube: rotateSide(cube, 'U', math.pi / 2),
    "D": lambda cube: rotateSide(cube, 'D', math.pi / 2),
    "D'": lambda cube: rotateSide(cube, 'D', -math.pi / 2),
    "F": lambda cube: rotateSide(cube, 'F',  -math.pi / 2),
    "F'": lambda cube: rotateSide(cube, 'F', math.pi / 2),
    "B": lambda cube: rotateSide(cube, 'B', math.pi / 2),
    "B'": lambda cube: rotateSide(cube, 'B', -math.pi / 2),
    "R": lambda cube: rotateSide(cube, 'R',  math.pi / 2),
    "R'": lambda cube: rotateSide(cube, 'R', -math.pi / 2),
    "L": lambda cube: rotateSide(cube, 'L', -math.pi / 2),
    "L'": lambda cube: rotateSide(cube, 'L', math.pi / 2),
}


def rotationsDemo():
    rs = ["X", "X'", "Y", "Y'", "Z", "Z'", "U", "U'", "D",
          "D'", "F", "F'", "B", "B'", "R", "R'", "L", "L'"]
    for i, r in enumerate(rs):
        cube = newCube('cube', (i * (cubeSize + 0.3), 0, 0))
        rotations[r](cube)


def shuffle(cube, rotationNames, keyDelta):
    for rName in rotationNames:
        rotation = rotations[rName]
        if rotation:
            keyDelta and setKeyframe(currentKeyframe() + keyDelta)
            rotation(cube)
            keyDelta and keyCubelets(cube.all_objects)


def performAnimation(fileName):
    with open(fileName, 'r') as animationFile:
        animationJson = animationFile.read()
    animationData = json.loads(animationJson)
    keyDelta = animationData['keyDelta']
    maxFrame = 1
    for cube in animationData['cubes']:
        x, y = cube['x'], cube['y']
        setKeyframe(1)
        currentCube = newCube('cube-'+str(x)+'-'+str(y), (-x * cubeSize, y * cubeSize, 0))
        keyCubelets(currentCube.all_objects)
        shuffle(currentCube, cube['permutations'], keyDelta)
        maxFrame = max(maxFrame, currentKeyframe())
        for cubelet in currentCube.all_objects:
            cubelet.select_set(True)
    if keyDelta:
        bpy.data.scenes['Scene'].frame_end = maxFrame
        setKeyframe(1)
    bpy.ops.view3d.camera_to_view_selected()


superflip = ["R", "L", "U", "U", "F", "U'", "D", "F", "F", "R", "R", "B", "B",
             "L", "U", "U", "F'", "B'", "U", "R", "R", "D", "F", "F", "U", "R", "R", "U"]
glider = ['Y',  'R',  "L'", 'U', "F'", 'R',
          'F',  'F', 'L',  "F'", 'R',  "D'", "R'"]
superflipTop = ['R',  'F',  'L', 'B', 'L',  'R',  'B',
                'U', 'F',  "U'", 'R', 'B', "F'", "R'", 'F', "B'"]
around = ['F', 'R', 'B', 'L']


performAnimation('/tmp/enthusiasticon_27.json')
