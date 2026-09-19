import json

with open('config_parsed.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

ext = config.get('theme', {}).get('extend', {})
css = '@theme {\n'

if 'colors' in ext:
    for k, v in ext['colors'].items():
        css += f'  --color-{k}: {v};\n'

if 'borderRadius' in ext:
    for k, v in ext['borderRadius'].items():
        key = 'radius' if k == 'DEFAULT' else f'radius-{k}'
        css += f'  --{key}: {v};\n'

if 'spacing' in ext:
    for k, v in ext['spacing'].items():
        css += f'  --spacing-{k}: {v};\n'

if 'fontFamily' in ext:
    for k, v in ext['fontFamily'].items():
        font = v[0]
        if ' ' in font:
            font = f'"{font}"'
        css += f'  --font-{k}: {font};\n'

css += '}\n'
with open('generated_theme.css', 'w', encoding='utf-8') as f:
    f.write(css)
