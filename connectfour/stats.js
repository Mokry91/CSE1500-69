var gameStats = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    playersOnline: 0 /* number of games initialized */,
    gamesAborted: 0 /* number of games aborted */,
    gamesInitialised: 0 /* number of games successfully completed */
  };
  