import * as ActionFunc from "../../redux/actions";
import {
  Action,
  SaveState,
  ReduxStateInterface,
  UpdatePipeline,
  SwitchPipeline,
  Dict
} from "../../redux/types";

describe("Test reset store action", () => {
  it("should return correct signal", () => {
    expect(ActionFunc.resetStore()).toEqual({ type: Action.RESET_STORE });
  });
});

describe("Test save state action", () => {
  let mockState: ReduxStateInterface;
  beforeAll(() => {
    mockState = {
      mainState: "foo",
      pipelines: [{ name: "local", children: ["bar", "bar1"] }],
      selectedData: [],
    };
  });

  it("should return correct signal", () => {
    const signal = ActionFunc.saveState("foo") as SaveState;
    expect(signal.name).toEqual("foo");
    expect(signal.type).toEqual(Action.SAVE_STATE);
  });

  it("_saveState should return correct state", () => {
    const state = ActionFunc.saveState_(mockState);
    expect(state.mainState).toEqual("foo");
    expect(state.pipelines).toEqual([
      { name: "local", children: ["bar", "bar1"] },
    ]);
    expect(state.selectedData).toEqual([]);
  });
});

describe("Test save state action", () => {
  let mockState: ReduxStateInterface;
  beforeAll(() => {
    mockState = {
      mainState: "foo",
      pipelines: [
        {
          name: "local",
          children: [
            { name: "bar", activated: false },
            { name: "bar1", activated: false },
          ],
        },
      ],
      selectedData: [],
    };
  });

  it("should return correct signal", () => {
    const signal = ActionFunc.saveState("foo") as SaveState;
    expect(signal.name).toEqual("foo");
    expect(signal.type).toEqual(Action.SAVE_STATE);
  });

  it("_saveState should return correct state", () => {
    const state = ActionFunc.saveState_(mockState);
    expect(state.mainState).toEqual("foo");
    expect(state.pipelines).toEqual([
      {
        name: "local",
        children: [
          { name: "bar", activated: false },
          { name: "bar1", activated: false },
        ],
      },
    ]);
    expect(state.selectedData).toEqual([]);
  });
});

describe("Test update  pipelines action", () => {
  let mockState: ReduxStateInterface;
  beforeAll(() => {
    mockState = {
      mainState: "foo",
      pipelines: [],
      selectedData: [],
    };
  });

  it("should return correct signal", () => {
    const signal = ActionFunc.updatePipeline([
      { foo: "bar" },
    ]) as UpdatePipeline;
    expect(signal.data).toEqual([{ foo: "bar" }]);
    expect(signal.type).toEqual(Action.UPDATE_PIPELINE);
  });

  it.each`
    old | data | newPipeline
    ${[]} | ${[{ name: "local", children: [
      { name: "bar", activated: false },
      { name: "bar1", activated: false },
    ] }]} | ${[{ name: "local", children: [
      { name: "bar", activated: false },
      { name: "bar1", activated: false },
    ] }]}
    ${[{ name: "local", children: [
      { name: "bar", activated: false },
      { name: "bar1", activated: false },
    ] }]} | ${[{ name: "local", children: [
      { name: "bar", activated: false },
      { name: "bar1", activated: false },
    ] }]} | ${[
  { name: "local", children: [
      { name: "bar", activated: false },
      { name: "bar1", activated: false },
    ] },
  { name: "local(1)", children: [
      { name: "bar", activated: false },
      { name: "bar1", activated: false },
    ] },
]}
  `(
    "_updatePipeline should return correct state",
    ({
      old,
      data,
      newPipeline,
    }: {
      old: Array<Dict>;
      data: Array<Dict>;
      newPipeline: Array<Dict>;
    }) => {
      const mockState = {
        mainState: "foo",
        pipelines: old,
        selectedData: [],
      };
      const action: UpdatePipeline = { type: Action.UPDATE_PIPELINE, data };
      const newState = ActionFunc._updatePipeline(mockState, action);
      expect(newState.pipelines).toEqual(newPipeline);
    }
  );
});

describe("Test switch  pipelines action", () => {
  let mockState: ReduxStateInterface;
  beforeAll(() => {
    mockState = {
      mainState: "foo",
      pipelines: [
        {
          name: "local",
          children: [
            { name: "bar", activated: false },
            { name: "bar1", activated: false },
          ],
        },
        {
          name: "local(1)",
          children: [
            { name: "bar", activated: false },
            { name: "bar1", activated: false },
          ],
        },
      ],
      selectedData: [],
    };
  });

  it("should return correct signal", () => {
    const signal = ActionFunc.switchPipeline({}) as SwitchPipeline;
    expect(signal.data).toEqual({});
    expect(signal.type).toEqual(Action.SWITCH_PIPELINE);
  });

  it("should update correct pipeline", () => {
    const data = {pipeline: "local", name : "bar", status : true }
    const action: SwitchPipeline = { type: Action.SWITCH_PIPELINE, data };
    const newState = ActionFunc._switchPipeline(mockState, action);
    expect(newState.pipelines[0].children[0]).toEqual({ name: "bar", activated: true });
  });
});
