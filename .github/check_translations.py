# SPDX-FileCopyrightText: Copyright (C) 2026 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

import json
import sys
from pathlib import Path
from typing import Any

MASTER_LANGUAGE = 'en'
TRANSLATION_ROOT = Path('translate/')

errors = []

def check_keys(first: dict[str, Any], second: dict[str, Any], language_file: Path, key: str = '') -> None:
    missing = first.keys() - second.keys()
    additional = second.keys() - first.keys()
    key = f' (within key: {key})' if key else ''
    if missing:
        errors.append(f'{language_file}{key}: missing keys: {missing}')

    if additional:
        errors.append(f'{language_file}{key}: additional keys: {additional}')

    for key in first.keys():
        if isinstance(first[key], dict):
            check_keys(first[key], second[key], language_file, key)


print(f'comparing language files in {TRANSLATION_ROOT}...')

master = json.loads(TRANSLATION_ROOT.joinpath(MASTER_LANGUAGE).with_suffix('.json').read_text())

for language_file in list(TRANSLATION_ROOT.glob('*.json')):
    print(language_file)
    if language_file.stem != MASTER_LANGUAGE:
        print(f'loading and comparing {language_file.name}...')
        language = json.loads(language_file.read_text())

        check_keys(master, language, language_file)

print('')

if len(errors) > 0:
    print('Found errors:\n')
    print('\n'.join(errors))
    sys.exit(1)

print('All language files have the same keys')
