import { SCREEN_NEXT, SCREEN_GRAPH } from '../reducers/screen.js';
import { PLAYER_RELATIONSHIP_UP, PLAYER_RELATIONSHIP_DOWN,
  PLAYER_NEXT_DAY, PLAYER_SET } from '../reducers/player.js';
import { SCRIPT_RELATIONSHIP_UP_END_DAY, SCRIPT_RELATIONSHIP_DOWN_END_DAY,
  SCRIPT_GRAPH, scriptIdForDay } from '../script.js';
import { getJson } from '../utils.js';

export const nextScreen = (scriptId) => async (dispatch) => {
  switch (scriptId) {
    case SCRIPT_GRAPH:
      return dispatch({ type: SCREEN_GRAPH });
    case SCRIPT_RELATIONSHIP_UP_END_DAY:
      dispatch({ type: PLAYER_RELATIONSHIP_UP });
      return dispatch(nextDay());
    case SCRIPT_RELATIONSHIP_DOWN_END_DAY:
      dispatch({ type: PLAYER_RELATIONSHIP_DOWN });
      return dispatch(nextDay());
    default:
      return dispatch({ type: SCREEN_NEXT, to: scriptId });
  }
}

export const nextDay = () => async (dispatch, getState) => {
  dispatch({ type: PLAYER_NEXT_DAY });
  const day = getState().player.day;
  dispatch({ type: SCREEN_NEXT, to: scriptIdForDay(day) });
};

export const pull = (name) => async (dispatch) => {
  const request = await getJson('/sync/info');
  
  const { day, relationship } = await request.json();
  dispatch({ type: PLAYER_SET, day, relationship, name });
  dispatch({ type: SCREEN_NEXT, to: scriptIdForDay(day) });
};
