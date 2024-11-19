FROM python:3.9.7-slim

# Set environment variables to prevent Python from writing pyc files to disc 
# and to prevent Python from buffering stdout and stderr
# This is useful to improve performance and logging behaviour in dockerised envs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install poetry
RUN pip install --upgrade pip \
    && pip install poetry

# Set the working directory in the container
WORKDIR /app

# Copy the Poetry files to the container
COPY pyproject.toml ./

# Install project dependencies using Poetry (without dev dependencies)
# Ensures Poetry installs the dependencies directly into the container's env instead of creating a virtual env 
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

# Copy the rest of the project files into the container
COPY . .

# requirements.txt replaced by poetry dependency management
# RUN pip install --no-cache-dir -r requirements.txt

# Expose port to run on
EXPOSE 6000

# Command to run the application
CMD ["gunicorn", "-b", "0.0.0.0:5050", "app:app"]