# Recipes service

## Using the recipes app

### Prerequisite: Ensure access to the Spoonacular API

The Spoonacular API is used to retrieve recipes for a user request made on the homepage of the recipes app.
The user request is made via a form submission that specifies the recipe to search for and the count of recipes to return. 
In order to access the Spoonacular API, an API URL and API key is required, which needs to be specified in the `recipes/.env`.

To obtain the API key, make an account on `https://spoonacular.com/food-api`. 
Once logged in, go to `My Console` > `Profile & API Key` to find and copy your personal API Key. 

### Run the app

1. set `SPOONACULAR_API_URL="https://api.spoonacular.com/recipes/complexSearch"` in `recipes/.env` (to test the recipes app only) and in `.env` at the root of the repo to test it when spinning up all microservices via `docker compose up --build`
2. set `SPOONACULAR_API_KEY=<YOUR API KEY, SEE EXPLANATION ABOVE>` in `recipes/.env` (to test the recipes app only) and in `.env` at the root of the repo to test it when spinning up all microservices via `docker compose up --build`
3. make sure you are in the `recipe` directory
4. set up the dependencies, i.e. `poetry install` (for details see ## Setup) 
5. run `python app.py`
6. navigate to `http://127.0.0.1:5051` in your browser (this address is also displayed in the terminal upon `python app.py`)
7. you can now enter a `recipe` (string) and a `count` (int), click the `submit` button, and see the returned recipes (titles and images)


## Setup

The recipes service uses poetry for dependency management.

### Quickstart: Set up poetry using an existing pyproject.toml

1. When you clone the repo, including all the changes in the `recipes` folder, you should see `recipes/pyproject.toml`. That file effectively replaces `requirements.txt`.
2. `poetry install` will install all the dependencies from the `pyproject.toml` file in a virtual environment for `recipes` and create a `poetry.lock` file (this should not be committed but simply used locally)
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

1. `cd recipes` if not already in the folder
2. `poetry init` to initialise a poetry project from the existing folder structure. This will create a `pyproject.toml` file, which serves as the central configuration file for the project.
3. `poetry add [dependency]` where dependency are each package listed in `requirements.txt`
4. `poetry config`, followed by `poetry config virtualenvs.in-project true` to create a vitual environment inside your project folder. This will place the .venv folder inside the project root. This also allows us to run a script simply via `python app.py` rather than `poetry run app.py`.
5. set `package-mode = false` in your `pyproject.toml` file under `[tool.poetry]`
6. `poetry install` to regenerate the virtual environment
7. `poetry shell` to activate the virtual environment where poetry has installed the dependencies

### Running unit tests
#### Running the whole test suite
- `poetry run pytest`

#### Running specific test file with verbose output
- `poetry run pytest tests/test_recipes.py -v`

### Running lint with Flake8
- `poetry run flake8`

### Run Static Security Analysis with Bandit
- `bandit -r .`