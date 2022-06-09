#!/usr/bin/env sh

case "$1" in
  "setup")
    echo "sh ./pre-push.sh" >> .git/hooks/pre-push
    chmod +x .git/hooks/pre-push
    ;;
  *)
    yarn typecheck &&
    yarn prettier &&
    yarn lint
    ;;
esac
