import {createStoreon} from "storeon";
import { persistState } from "@storeon/localstorage";
import auth from "./auth";

export const store = createStoreon([
  auth,
  persistState(["auth"])
]);
