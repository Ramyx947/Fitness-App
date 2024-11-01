# Analytics service

## Setup

The analytics service uses poetry for dependency management.

### Quickstart: Set up poetry using an existing pyproject.toml

1. When you clone the repo, including all the changes in the `analytics` folder, you should see `analytics/pyproject.toml`. That file effectively replaces `requirements.txt`.
2. `poetry install` will install all the dependencies from the `pyproject.toml` file in a virtual environment for `analytics` and create a `poetry.lock` file which should be committed to ensure all environments use the exact same dependency version.
3. run your python script as usual, e.g. `python app.py`, which will now use all the dependencies managed by poetry

### Useful poetry commands
- `poetry remove [package]` to remove a dependency
- `poetry add [package]` to add a dependency
- `poetry update` to update dependencies in `pyproject.toml`; especially useful after adding / removing a package.

Note: Never update the `pyproject.toml` file manually - it should be managed via the `poetry add / remove` commands. 


### Troubleshooting

#### VS code cannot find packages

If VS does not find poetry's virtual environment, the packages in the Python script might still be underlined. To mitigate this:

- `poetry env info` to verify the path where poetry has installed the virtual environment for the project; normally under `Users/[user]/Library/Caches/pypoetry/virtualenvs/` 
- `command + shift + p` to open the VS search bar
- select `Python: Select Interpreter`
- select `Enter Interpreter Path`
- paste in the path to the virtual env created by poetry returned from `poety env info`

### In depth: set up poetry from scratch:

1. `cd analytics` if not already in the folder
2. `poetry init` to initialise a poetry project from the existing folder structure. This will create a `pyproject.toml` file, which serves as the central configuration file for the project.
3. `poetry add [dependency]` where dependency are each package listed in `requirements.txt`
4. `poetry config`, followed by `poetry config virtualenvs.in-project true` to create a vitual environment inside your project folder. This will place the .venv folder inside the project root. This also allows us to run a script simply via `python app.py` rather than `poetry run app.py`.
5. set `package-mode = false` in your `pyproject.toml` file under `[tool.poetry]`
6. `poetry install` to regenerate the virtual environment
7. `poetry shell` to activate the virtual environment where poetry has installed the dependencies