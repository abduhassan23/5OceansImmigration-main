# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements file into the container
COPY requirements.txt /app/

# Install virtualenv
RUN pip install --no-cache-dir virtualenv

# Create a virtual environment
RUN virtualenv /app/.venv

# Activate the virtual environment and install dependencies
RUN /app/.venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the entire app into the container (including the Flask app)
COPY . /app

# Expose the port for the Flask app
EXPOSE 8000

# Set the default command to run the Flask API
CMD ["/app/.venv/bin/python", "/app/trigger_script.py"]

