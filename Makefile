SHELL=/bin/bash
.ONESHELL:

all: build

env:
	[ -d env ] || virtualenv -p python3 env

python_requirements:
	source env/bin/activate
	pip install -r requirements.txt

js_requirements:
	npm install
	npm run build

migrations:
	source env/bin/activate
	python manage.py migrate

run:
	source env/bin/activate
	python manage.py runserver

build: env python_requirements migrations js_requirements

clean:
	rm -r node_modules
	rm -r env
	rm -r static

admin:
	source env/bin/activate
	python manage.py createsuperuser --username admin --email admin@localhost