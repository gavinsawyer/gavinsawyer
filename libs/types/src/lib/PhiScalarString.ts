/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type PxScalarString }  from "./PxScalarString";
import { type RemScalarString } from "./RemScalarString";
import { type VariableString }  from "./VariableString";


export type PhiScalarString = `calc(${ PxScalarString | RemScalarString | VariableString } * pow(var(--phi), ${ number }))`;
