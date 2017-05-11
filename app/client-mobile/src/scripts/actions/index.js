export function createApiAction(actionType, func = ()=>{}) {
  return (
    params = {},
    callback = { success: () => {}, failed: () => {} },
    customActionType = actionType,
  ) => async dispatch => {
    try {
      dispatch({ type: customActionType + '_REQUEST', params: params });
      
      let data = await func(params);
      dispatch({ type: customActionType, params: params, payload: data });

      callback.success && callback.success({ payload: data })
    } catch (e) {
      dispatch({ type: customActionType + '_FAILURE', params: params, payload: e })
      
      callback.failed && callback.failed({ payload: e })
    }
  }
}