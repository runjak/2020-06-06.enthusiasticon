# 2020-06-06.enthusiasticon

[EnthusiastiCon](https://www.enthusiasticon.de/) is a remote conference
for the programming community scheduled for `2020-06-06`.
This Repo is the designated location for my talk proposal and subsequent materials.

The [CfP](https://www.enthusiasticon.de/cfp/) was extended to `2020-05-03`,
and I've handed in a [proposal](proposal.md) to it.

## Usage

Below are some things I like to do with the code in this repo:

### Dependencies

* Some of the code is typescript and to be used with node.
  * I like using `yarn`, but `npm` should work just as well.
  * Run `yarn install; yarn build` to install dependencies and compile
    * You could also run this with `ts-node`, but it's a bit more resource hungry.
* To render animations blender and python are used.

### Slides

Use `yarn slides` to view the slides of the talk.

### Converting and resizing

The node portion of code deals with `.png` images exclusively
and works on the assumption that images are already of the desired size.
I like to use the `convert` tool that comes with
[ImageMagick](https://imagemagick.org/index.php) to convert and resize images:
`convert $input --resize 48x48 output.png`

The scripts truncate images to the highest multiple of `3` in each dimension.
Images don't have to be square or of a specific size.
It's just that larger sizes imply bigger computational work and file sizes.

### Image Quantization

The scripts make use of the [image-q](https://github.com/ibezkrovnyi/image-quantization)
library to reduce the color palette so that it fits the 6 colors of our cubes.

Execution of `yarn quantify test.png` will result in the creation of several
quantified images in the same place as `test.png`,
but with the specific quantization in the file name, such as `test.floyd-steinberg.png`.

### Animation JSON

Call of `yarn animate test.floyd-steinberg.png` will result in a `test.floyd-steinberg.json`
that contains animations for the cubes.
The `animate` script works on the assumption that the image was quantized before.

### Creating a blend file

Call of `yarn mkBlend test.floyd-steinberg.json blender/test.blend` will result
in execution of the `blender/rotations.py` script in blender
using the `template.blend` as the template for our cube.

The resulting `blender/test.blend` file can be rendered and used with blender regularly.
For example I like rendering headless with `blender --background test.blend -a`.
The `template.blend` is set to render a `.mp4` and save it in `/tmp/`,
which is copied over to the `test.blend`, but can of course be adjusted at will.

## Sources

I'm trying to keep track of sources I've used to at least some extend:

* Wikipedia:
  * [Rubiks Cube](https://en.wikipedia.org/wiki/Rubik%27s_Cube)
  * [Kociemba's algorithm](https://en.wikipedia.org/wiki/Optimal_solutions_for_Rubik%27s_Cube#Kociemba's_algorithm)
  * [Cayley graph](https://en.wikipedia.org/wiki/Cayley_graph)
  * [Symmetric group](https://en.wikipedia.org/wiki/Symmetric_group)
* [Rubik's for cryptographers](http://www0.cs.ucl.ac.uk/staff/c.petit/rubik.html)
* [Cayley graphs](https://www.jaapsch.net/puzzles/cayley.htm)
* [Ruwix: Twisty Puzzles](https://ruwix.com/twisty-puzzles/)
* YouTube
  * [Cycle notation of permutations](https://www.youtube.com/watch?v=MpKG6FmcIHk)
  * [Matt Parker on impossible Rubiks Cubes](https://www.youtube.com/watch?v=PLAFNvxDPMw)
* Ruwix:
  * [Rubik's cube notation](https://ruwix.com/the-rubiks-cube/notation/)
  * [Advanced Rubik's cube notation](https://ruwix.com/the-rubiks-cube/notation/advanced/)
  * [Rubik's cube algorithms](https://ruwix.com/the-rubiks-cube/algorithm/)
  * [Mathematics of the Rubik's cube](https://ruwix.com/the-rubiks-cube/mathematics-of-the-rubiks-cube-permutation-group/)
* [Metamagical Themas](https://en.wikipedia.org/wiki/Metamagical_Themas):
  * Chapter 14: Magic Cubology
* Blender stackexchange for a question regarding rotations of cubelets:
  * [How to sort objects from a collection using python](https://blender.stackexchange.com/questions/179364/how-to-sort-objects-from-a-collection-using-python)

## Tweets

I've tweeted about related topics in the past
and use this list to find my old tweets again:

* [Happy about holding my current cube in hands the first time](https://twitter.com/sicarius/status/981664903877578752)
* [Permuting some bs on a 7x7x7 cube](https://twitter.com/sicarius/status/1017447426679083008)
* [1/3 of a receiving a bunch of cubes](https://twitter.com/sicarius/status/1019542554784694273)
* [A dino mosaic](https://twitter.com/sicarius/status/1020378934008049664)
* [Several mosaics](https://twitter.com/sicarius/status/1024214508779257861)
* [A bw scene](https://twitter.com/sicarius/status/1062466381252300801)
* [The mosaic table](https://twitter.com/sicarius/status/1071485356934135808)
* [Special-spork recordings with OBS](https://twitter.com/sicarius/status/1138140560739524609)
* [Special-spork restickering](https://twitter.com/sicarius/status/1139284954339147776)
* [Special-spork broken](https://twitter.com/sicarius/status/1139621566831050752)
* [A rotated corner](https://twitter.com/sicarius/status/1173270682962149380)
* [One more logo](https://twitter.com/sicarius/status/1250524776361340929)
* [Python+Blender cube factory](https://twitter.com/sicarius/status/1262014566000734209)
* [Getting rotations to work](https://twitter.com/sicarius/status/1263515774225956865)
* [BBB more logo](https://twitter.com/sicarius/status/1263928313862651904)
* [Superflip](https://twitter.com/sicarius/status/1264147673403318273)

## Screenshots

Out of amusement I took some screenshots where things went in unexpected directions.

Some rotations used unexpected axis:
![Bottom plane rotated along wrong axis by 180°](assets/screenshots/2020-05-16.23:26:01.png)
![Bottom plane rotated along wrong axis by 90°](assets/screenshots/2020-05-16.23:29:50.png)

I was happy once the cloning of cubes from my template worked, and so made a whole field:
![A field of 16*16 cubes](assets/screenshots/2020-05-17.15:34:18.png)

To practise selecting a side of the cube I used these cubes and tried to delete their inner sides:
![Example cubes with deleted sides](assets/screenshots/2020-05-17.23:50:23.png)

Somehow two rotations were working in sequence:
![A cube rotated FR'](assets/screenshots/2020-05-18.00:05:43.png)

Shortly after that the superflip worked:
![A working superflip](assets/screenshots/2020-05-21.11:12:01.png)

Side selection was not always working:
![The side selection demo, but it's always deleting the down side](assets/screenshots/2020-05-21.19:39:05.png)

In between people liked to draw on some shared sceenshots:

![Theres a dino and a fish on this one](assets/screenshots/2020-05-22.22:21:09.png)
![The dino here has a flower now](assets/screenshots/2020-05-22.22:37:39.png)

A bunch of cubes was broken by incorrectly rotating stuff into each other.
This was often due to trouble correctly selecting the cubelets that needed rotation or due to wrongly performing the rotations:

![example of a broken cube](assets/screenshots/2020-05-23.11:14:22.png)
![example of a broken cube](assets/screenshots/2020-05-24.12:10:51.png)
![example of a broken cube](assets/screenshots/2020-05-24.12:11:09.png)
![example of a broken cube](assets/screenshots/2020-05-22.17:09:17.png)
![example of a broken cube](assets/screenshots/2020-05-22.17:09:27.png)

It finally worked out to rotate a bunch of cubes automagically to build the [Chaotikum Logo](https://chaotikum.org/) - except it was mirrored and some of the cubes were just wrong :)
![Chaotikum logo](assets/screenshots/2020-05-24.23:06:35.png)
