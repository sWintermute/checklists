import injector from 'vue-inject'
import { $axios } from '@/services/constants'

import createUsersRepository from '@/services/repositories/usersRepository'
import createChecklistsRepository from '@/services/repositories/checklistsRepository'
// import createPackageRepository from '~/repositories/PackageRepository'
// import createTaskRepository from '~/repositories/TasksRepository'

const usersRepository = createUsersRepository($axios)
const сhecklistsRepository = createChecklistsRepository($axios)
// const packageRepository = createPackageRepository(ctx.$axios)
// const taskRepository = createTaskRepository(ctx.$axios)


// const normRepository = createNormRepository(ctx.$axios)
// const signUserRepository = createSignUsers(ctx.$axios)
// const filesRepository = createFiles(ctx.$axios)

const repositories = () => {
  return {
    users: usersRepository('/api'),
    checklists: сhecklistsRepository('api/v1/lists'),
    // packages: packageRepository('/contragents'),
    // tasks: taskRepository('/tasks'),
    // norms: normRepository('/norms'),
    // signUsers: signUserRepository('/sign_users'),
    // files: filesRepository('/contragents')
}
}

injector.service('$repositories', ['$axios'], repositories)
