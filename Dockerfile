# build environment
FROM node:12.16.1-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./split-webapp/split/package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.0.1 -g
COPY ./split-webapp/split /app
RUN npm run build

# production environment
FROM python:3.9.0a4-buster
WORKDIR /app
ENV SITE_ROOT ./static
ENV SITE_PORT 80
RUN pip install cherrypy
COPY ./server/src /app
COPY --from=build /app/build /app/static
EXPOSE 80
CMD ["python3", "/app/main.py"]