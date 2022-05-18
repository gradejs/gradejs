
#!/bin/bash

case "$EB_START" in
  "api")
      echo "Starting public-api package"
      yarn workspace @gradejs-public/public-api start
      ;;

  "worker")
      echo "Starting worker package"
      yarn workspace @gradejs-public/worker start
      ;;

  *)
      echo "Unknown package to start EB_START=$EB_START"
      exit 1
      ;;
esac