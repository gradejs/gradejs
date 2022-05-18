
#!/bin/bash

case "$EB_START" in
  "api")
      echo "Starting public-api package"
      npm start --prefix packages/public-api
      ;;

  "worker")
      echo "Starting worker package"
      npm start --prefix packages/worker
      ;;

  *)
      echo "Unknown package to start EB_START=$EB_START"
      exit 1
      ;;
esac