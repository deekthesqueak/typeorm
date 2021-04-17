import { AnyModel } from "../../../repository/model"
import { AnyDriver, DriverTypes } from "../driver"
import { ValueOf } from "../util"
import { EntityColumnList } from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityModel } from "./entity-model"
import { EntityRelationList } from "./entity-relations"

/**
 * Represents any entity. Convenience type.
 */
export type AnyEntity = EntityCore<
  AnyDriver,
  AnyModel,
  EntityColumnList<AnyDriver["types"]>,
  EntityRelationList,
  EntityEmbedList<AnyDriver>
>

/**
 * Core entity.
 * Drivers must build their entities and return this interface.
 */
export interface EntityCore<
  Driver extends AnyDriver,
  Model extends AnyModel,
  Columns extends EntityColumnList<Driver["types"]>,
  Relations extends EntityRelationList,
  Embeds extends EntityEmbedList<Driver>
> {
  "@type": "Entity"
  driver: Driver
  model: Model
  columns: Columns
  relations: Relations
  embeds: Embeds
  columnsEmbeds: Columns & Embeds
  columnsEmbedsRelations: Columns & Embeds & Relations
}

export type EntityResolver<Entity extends AnyEntity> = {}

export type EntityCustomRepository<
  Entity extends AnyEntity,
  CustomRepository
> = {
  entity: Entity
  repository: CustomRepository
}

export type AnyEntityCollection = EntityCollection<AnyEntityList>

export type EntityResolveMap<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = {
  [P in keyof Entity["model"]["type"]]?: Entity["model"]["type"][P] extends Function
    ? (
        ...args: Parameters<Entity["model"]["type"][P]>
      ) =>
        | ReturnType<Entity["model"]["type"][P]>
        | Promise<ReturnType<Entity["model"]["type"][P]>>
    : (
        entity: EntityModel<Types, Entities, Entity>,
      ) =>
        | ReturnType<Entity["model"]["type"][P]>
        | Promise<ReturnType<Entity["model"]["type"][P]>>
}

export type AnyRepositoryList = {
  [entityName: string]: any
}

export interface EntityCollection<Entities extends AnyEntityList> {
  "@type": "EntityCollection"
  entities: Entities
}

/**
 * List of named entities.
 */
export type AnyEntityList = {
  [name: string]: AnyEntity
}

/**
 * Extracts entity that was referenced in a given entity relation.
 * For example for ReferencedEntity<Any, User, "avatar"> returns "Photo" entity.
 */
export type ReferencedEntity<
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  RelationName extends keyof Entity["relations"]
> = Entities[Entity["relations"][RelationName]["reference"]]

/**
 * Entity reference can either be an entity name, either reference to entity declaration.
 */
export type EntityReference<Entities extends AnyEntityList> =
  | keyof Entities
  | ValueOf<Entities>

/**
 * Resolves given entity or entity name to the entity.
 * If given value is entity name, finds entity with such name and returns it.
 * If given value is entity itself, simply returns it.
 */
export type EntityPointer<
  Entities extends AnyEntityList,
  Reference extends EntityReference<Entities>
> = Reference extends keyof Entities
  ? Entities[Reference]
  : Reference extends ValueOf<Entities>
  ? Reference
  : never
