# run-s-p
Run commands in sequence or in parallel.

#### Commands
- `run -s ...` Runs commands in sequential order.
- `run -p ...` Runs commands in parallel order.

#### How to use
`package.json`
```json
{
  "scripts": {
    "test": "run -s \"echo hello\" \"echo goodbye\"",
    "start": "run -p server watch",
    "server": "node server.js",
    "watch": "nodemon . --exec npm run server",
  }
}
```
