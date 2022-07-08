/*
 *  Copyright 2019, 2020, 2021, 2022 LiteFarm.org
 *  This file is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const { transaction, Model } = require('objection');
const LocationModel = require('./locationModel');
const PartnerReadingTypeModel = require('../models/PartnerReadingTypeModel');

class Sensor extends Model {
  static get tableName() {
    return 'sensor';
  }

  static get idColumn() {
    return 'sensor_id';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['farm_id', 'name', 'partner_id', 'external_id', 'location_id'],

      properties: {
        sensor_id: { type: 'string' },
        farm_id: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        partner_id: { type: 'integer' },
        external_id: { type: 'string', maxLength: 255 },
        location_id: { type: 'string' },
        depth: { type: 'float' },
        elevation: { type: 'float' },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    return {
      sensor_reading_type: {
        modelClass: require('./SensorReadingTypeModel'),
        relation: Model.HasManyRelation,
        join: {
          from: 'sensor.sensor_id',
          to: 'sensor_reading_type.sensor_id',
        },
      },
    };
  }

  static async createSensor(sensor, farm_id, user_id, partnerId) {
    const trx = await transaction.start(Model.knex());

    try {
      const readingTypes = await Promise.all(
        sensor.reading_types.map(async (r) => {
          return await PartnerReadingTypeModel.getReadingTypeByReadableValue(r);
        }),
      );

      const data = {
        farm_id,
        figure: {
          point: { point: { lat: sensor.latitude, lng: sensor.longitude } },
          type: 'sensor',
        },
        name: sensor.name,
        notes: '',
        sensor: {
          farm_id,
          name: sensor.name,
          partner_id: partnerId,
          depth: sensor.depth,
          external_id: sensor.external_id,
          sensor_reading_type: readingTypes.map((readingType) => {
            return { partner_reading_type_id: readingType.partner_reading_type_id };
          }),
        },
      };

      const sensorLocationWithGraph = await LocationModel.createOrUpdateLocation(
        'sensor',
        { user_id },
        data,
        trx,
      );
      await trx.commit();
      return sensorLocationWithGraph;
    } catch (error) {
      console.log(error);
      await trx.rollback();
      return null;
    }
  }
}

module.exports = Sensor;