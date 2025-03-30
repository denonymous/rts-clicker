import type { Resource } from '../types/resources'

type ResourcesComponentProps = {
  resources: readonly Resource[]
}

export const ResourcesComponent = ({ resources }: ResourcesComponentProps) => {
  return (
    <section>
      {
        resources.map(e => <ResourceComponent key={`Resource-${e.__id}`} resource={e} />)
      }
    </section>
  )
}

type ResourceComponentProps = {
  resource: Resource
}

const ResourceComponent = ({ resource }: ResourceComponentProps) => {
  return (
    <article>
      {resource.name}: {resource.currentValue}/{resource.initValue} [{resource.location.coords.x},{resource.location.coords.y}]
    </article>
  )
}
