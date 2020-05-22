FROM node:14.3.0
COPY . /front/
WORKDIR /front/
RUN npm install
ENV PATH /front/node_modules/.bin:$PATH
