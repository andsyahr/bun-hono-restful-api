## Development

- To run in development environment:

```sh
docker compose -f docker-compose.dev.yml --env-file .env.development up -d --build
```

Open http://localhost:3000

- To access terminal inside container

```sh
docker exec -it <container_id_or_name> bash
```

- To view trace live logs

```sh
docker logs -f <container_id_or_name>
```

- To stop container:

```sh
docker compose -f docker-compose.dev.yml --env-file .env.development down
```

## Production

To run in production environment:

```sh
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

- To stop container:

```sh
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

## Tips

If you use the docker-compose.dev.yml file often, you can set an environment variable so you don’t need to use the -f flag every time:

```sh
export COMPOSE_FILE=docker-compose.dev.yml
export $(grep -v '^#' .env.development | xargs)
```

Now, you can run commands like:

```sh
docker compose up -d
docker compose down
```
