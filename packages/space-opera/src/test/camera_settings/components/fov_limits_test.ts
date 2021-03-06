/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


import '../../../components/camera_settings/components/fov_limits.js';

import {DEFAULT_MAX_FOV, FovLimits} from '../../../components/camera_settings/components/fov_limits.js';
import {dispatchFovLimits, getCamera} from '../../../components/camera_settings/reducer.js';
import {getModelViewer} from '../../../components/model_viewer_preview/model_viewer.js';
import {ModelViewerPreview} from '../../../components/model_viewer_preview/model_viewer_preview.js';
import {reduxStore} from '../../../space_opera_base.js';

xdescribe('fov limits editor test', () => {
  let fovLimitsDeg: FovLimits;
  let preview: ModelViewerPreview;

  beforeEach(async () => {
    preview = new ModelViewerPreview();
    document.body.appendChild(preview);
    await preview.updateComplete;

    fovLimitsDeg = new FovLimits();
    document.body.appendChild(fovLimitsDeg);
    dispatchFovLimits({enabled: false, min: 0, max: 0});
    await fovLimitsDeg.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(preview);
    document.body.removeChild(fovLimitsDeg);
  });

  it('correctly loads fov limits', async () => {
    dispatchFovLimits({enabled: true, min: 12, max: 34});
    await fovLimitsDeg.updateComplete;
    expect(fovLimitsDeg.inputLimits.enabled).toEqual(true);
    expect(fovLimitsDeg.inputLimits.min).toEqual(12);
    expect(fovLimitsDeg.inputLimits.max).toEqual(34);
  });

  it('correctly dispatches when I click set and clear', async () => {
    dispatchFovLimits({enabled: true, min: 0, max: 99});
    const modelViewer = getModelViewer()!;
    modelViewer.fieldOfView = '42deg';
    await fovLimitsDeg.updateComplete;

    (fovLimitsDeg.shadowRoot!.querySelector('#set-max-button')! as
     HTMLInputElement)
        .click();
    expect(getCamera(reduxStore.getState()).fovLimitsDeg!.max).toEqual(42);

    (fovLimitsDeg.shadowRoot!.querySelector('#clear-max-button')! as
     HTMLInputElement)
        .click();
    expect(getCamera(reduxStore.getState()).fovLimitsDeg!.max)
        .toEqual(DEFAULT_MAX_FOV);
  });
});
