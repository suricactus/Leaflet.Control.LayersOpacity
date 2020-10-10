/**
MIT License

Copyright (c) 2020 Ivan Ivanov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

L.Control.LayersOpacity = L.Control.Layers.extend({
  _addItem: function (obj) {
    var label = document.createElement('label'),
        checked = this._map.hasLayer(obj.layer),
        input;

    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement('leaflet-base-layers_' + L.Util.stamp(this), checked);
    }

    this._layerControlInputs.push(input);
    input.layerId = L.Util.stamp(obj.layer);

    L.DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.innerHTML = obj.name;

    // we assume all non raster layers start from 50%
    var value = (obj.layer._url === undefined) ? 50 : obj.layer.options.opacity * 100;
    var br = document.createElement('br');
    var rangeInput = this._createRangeElement(value);
    rangeInput.dataset.layerId = L.Util.stamp(obj.layer)

    L.DomEvent.on(rangeInput, 'click', this._onRangeInputClick, this);
    L.DomEvent.on(rangeInput, 'touchend', this._onRangeInputClick, this);

    // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771
    var holder = document.createElement('div');

    label.appendChild(holder);
    holder.appendChild(input);
    holder.appendChild(name);
    holder.appendChild(br);
    holder.appendChild(rangeInput);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(label);

    this._checkDisabledLayers();
    return label;
  },
  _createRangeElement: (value) => {
    var input = document.createElement('input');

    input.type = 'range';
    input.className = 'leaflet-control-layers-range';
    input.min = 0;
    input.max = 100;
    input.value = value;

    return input;
  },
  _onRangeInputClick: function (evt) {
    this._handlingClick = true;

    var opacity = evt.target.value / 100;
    var layer = this._getLayer(+evt.target.dataset.layerId).layer;

    if (layer._url === undefined) {
      layer.setStyle({ opacity: opacity, fillOpacity: opacity });
    } else {
      layer.setOpacity(opacity);
    }

    this._handlingClick = false;

    this._refocusOnMap();
  }
});

L.control.layersOpacity = function(baseLayers, overlayLayers, options) {
  return new L.Control.LayersOpacity(baseLayers, overlayLayers, options);
};
