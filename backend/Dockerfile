FROM python:3.6
ENV PYTHONUNBUFFERED 1

COPY . /backend/
WORKDIR /backend/
RUN pip install -r requirements.txt
RUN mkdir -p /static