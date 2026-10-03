"""Rebuild the portfolio wordmark in Blender 5.2: blender --background --python art/wordmark/render.py."""

from pathlib import Path

import bpy
from mathutils import Matrix, Vector


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "brand"
OUTPUT.mkdir(parents=True, exist_ok=True)

# A separate scene keeps any existing work in the open Blender file intact.
scene = bpy.data.scenes.new("Portfolio — embossed signature")
bpy.context.window.scene = scene
bpy.ops.import_curve.svg(filepath=str(ROOT / "public" / "logo.svg"))
curves = [obj for obj in scene.objects if obj.type == "CURVE"]
assert curves, "The source logo must import as curves."
bpy.context.view_layer.update()
points = [obj.matrix_world @ Vector(corner) for obj in curves for corner in obj.bound_box]
low = Vector(tuple(min(p[i] for p in points) for i in range(3)))
high = Vector(tuple(max(p[i] for p in points) for i in range(3)))
scale = 10 / (high.x - low.x)
center = (low + high) / 2

material = bpy.data.materials.new("Signature — warm ceramic / graphite")
material.use_nodes = True
shader = next(node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
shader.inputs["Roughness"].default_value = 0.38
shader.inputs["Specular IOR Level"].default_value = 0.3

for index, obj in enumerate(curves):
    obj.name = f"Signature curve {index + 1:02d}"
    obj.data.transform(Matrix.Scale(scale, 4) @ Matrix.Translation(-center) @ obj.matrix_world)
    obj.matrix_world = Matrix.Identity(4)
    for spline in obj.data.splines:
        for point in spline.bezier_points:
            point.radius = 1
    obj.data.dimensions = "2D"
    obj.data.fill_mode = "BOTH"
    obj.data.resolution_u = 24
    obj.data.extrude = 0.04
    obj.data.bevel_depth = 0.032
    obj.data.bevel_resolution = 5
    obj.data.materials.clear()
    obj.data.materials.append(material)

world = bpy.data.worlds.new("Signature studio")
world.use_nodes = True
scene.world = world
background = next(node for node in world.node_tree.nodes if node.type == "BACKGROUND")
background.inputs["Color"].default_value = (0.8, 0.8, 0.8, 1)
background.inputs["Strength"].default_value = 0.25


def softbox(name, location, power, size):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = power
    light.shape = "DISK"
    light.size = size
    obj = bpy.data.objects.new(name, light)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (-obj.location).to_track_quat("-Z", "Y").to_euler()
    return light


key = softbox("Broad upper-left softbox", (-3, 4, 5), 1000, 5)
fill = softbox("Quiet right fill", (4, -1, 4), 180, 4)
rim = softbox("Top edge light", (1, 3, 1), 350, 3)

camera = bpy.data.cameras.new("Signature orthographic camera")
camera.type = "ORTHO"
camera.ortho_scale = 10.65
camera_obj = bpy.data.objects.new("Signature camera", camera)
scene.collection.objects.link(camera_obj)
camera_obj.location = (0, -1.2, 20)
camera_obj.rotation_euler = (-camera_obj.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = camera_obj
scene.render.resolution_x = 1800
scene.render.resolution_y = 480
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.quality = 95
try:
    scene.render.engine = "CYCLES"
except TypeError:
    scene.render.engine = bpy.context.scene.render.engine
if scene.render.engine == "CYCLES":
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True


def set_material(theme):
    if theme == "light":
        shader.inputs["Base Color"].default_value = (0.9, 0.83, 0.7, 1)
        shader.inputs["Metallic"].default_value = 0.05
        key.energy, fill.energy, rim.energy = 1000, 180, 350
    else:
        shader.inputs["Base Color"].default_value = (0.047, 0.05, 0.058, 1)
        shader.inputs["Metallic"].default_value = 0.2
        key.energy, fill.energy, rim.energy = 1100, 110, 500


def render(theme):
    set_material(theme)
    scene.render.filepath = str(OUTPUT / f"wordmark-{theme}.webp")
    bpy.ops.render.render(write_still=True)


def render_letters(theme):
    set_material(theme)
    letters = sorted(curves, key=lambda obj: min(corner[0] for corner in obj.bound_box))
    assert len(letters) == 4, "The signature must contain exactly four separate letter curves."
    camera_matrix = camera_obj.matrix_world.copy()
    camera_scale = camera.ortho_scale
    resolution = (scene.render.resolution_x, scene.render.resolution_y)
    try:
        for index, (name, letter) in enumerate(zip(("a1", "n", "a2", "s"), letters)):
            for obj in letters:
                obj.hide_render = obj != letter
            camera_obj.matrix_world = camera_matrix
            camera.ortho_scale = camera_scale
            scene.render.resolution_x, scene.render.resolution_y = resolution
            scene.render.filepath = str(OUTPUT / f"letter-{name}-front-{theme}.webp")
            bpy.ops.render.render(write_still=True)

            corners = [letter.matrix_world @ Vector(corner) for corner in letter.bound_box]
            middle = sum(corners, Vector()) / 8
            side = -1 if index % 2 == 0 else 1
            camera_obj.location = middle + Vector((side * 8, -3, 13))
            direction = (middle - camera_obj.location).normalized()
            right = direction.cross(Vector((0, 1, 0))).normalized()
            up = right.cross(direction)
            camera_obj.rotation_euler = Matrix((right, up, -direction)).transposed().to_euler()
            camera.ortho_scale = max(letter.dimensions.x, letter.dimensions.y) * 1.2
            scene.render.resolution_x = scene.render.resolution_y = 512
            scene.render.filepath = str(OUTPUT / f"letter-{name}-side-{theme}.webp")
            bpy.ops.render.render(write_still=True)
    finally:
        for obj in letters:
            obj.hide_render = False
        camera_obj.matrix_world = camera_matrix
        camera.ortho_scale = camera_scale
        scene.render.resolution_x, scene.render.resolution_y = resolution
        scene.render.filepath = str(OUTPUT / f"wordmark-{theme}.webp")


if __name__ == "__main__":
    for theme in ("light", "dark"):
        render(theme)
        render_letters(theme)
    bpy.data.libraries.write(str(Path(__file__).with_name("wordmark.blend")), {scene}, fake_user=True)
