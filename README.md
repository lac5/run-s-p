# run-seq-s-p
Run commands in sequence or in parallel.

#### Commands
- `run-seq -s ...` Runs commands in sequential order.
- `run-seq -p ...` Runs commands in parallel order.

#### How to use
`package.json`
```json
{
  "scripts": {
    "test": "run-seq -s \"echo hello\" \"echo goodbye\"",
    "start": "run-seq -p server watch",
    "server": "node server.js",
    "watch": "nodemon . --exec npm run server",
  }
}
```
