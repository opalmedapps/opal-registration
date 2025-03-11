import json
import sys
from pathlib import Path

import bs4
import markdown

dependencies: set[str] = set()

# load direct dependencies (excluding dev)
with Path('package-lock.json').open() as fd:
    package_data = json.load(fd)

for package_name in package_data['packages']['']['dependencies']:
    dependencies.add(package_name)

# parse third-party notice by converting it to HTML and reading the level 2 headings out
with Path('THIRDPARTY.md').open() as fd:
    notice_text = fd.read()

html = markdown.markdown(notice_text)
soup = bs4.BeautifulSoup(html, 'html.parser')

dependencies_in_notice = {heading.text for heading in soup.find_all('h2')}

if dependencies != dependencies_in_notice:
    extra_in_dependencies = dependencies.difference(dependencies_in_notice)
    extra_in_notice = dependencies_in_notice.difference(dependencies)

    print('mismatch between declared dependencies in lock file ({file}) and THIRDPARTY.md found:')
    print(f'dependencies only in lock file: {", ".join(extra_in_dependencies)}')
    print(f'dependencies only in notice: {", ".join(extra_in_notice)}')

    sys.exit(1)
