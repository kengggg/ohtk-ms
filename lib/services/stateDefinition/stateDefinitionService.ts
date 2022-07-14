import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  StateDefinitionsDocument,
  StateDefinitionCreateDocument,
  StateDefinitionUpdateDocument,
  GetStateDefinitionDocument,
} from "lib/generated/graphql";
import { StateDefinition } from "lib/services/stateDefinition/stateDefinition";
import {
  DeleteResult,
  GetResult,
  IService,
  QueryResult,
  SaveResult,
} from "lib/services/interface";

export interface IStateDefinitionService extends IService {
  fetchStateDefinitions(
    limit: number,
    offset: number,
    searchText: string
  ): Promise<QueryResult<StateDefinition[]>>;

  getStateDefinition(id: string): Promise<GetResult<StateDefinition>>;

  createStateDefinition(
    name: string,
    isDefault: boolean
  ): Promise<SaveResult<StateDefinition>>;

  updateStateDefinition(
    id: string,
    name: string,
    isDefault: boolean
  ): Promise<SaveResult<StateDefinition>>;

  deleteStateDefinition(id: string): Promise<DeleteResult>;
}

export class StateDefinitionService implements IStateDefinitionService {
  client: ApolloClient<NormalizedCacheObject>;
  fetchStateDefinitionsQuery = {
    limit: 20,
    offset: 0,
    nameStartWith: "",
    ordering: "name,asc",
  };

  constructor(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
  }

  async fetchStateDefinitions(
    limit: number,
    offset: number,
    searchText: string
  ) {
    this.fetchStateDefinitionsQuery = {
      ...this.fetchStateDefinitionsQuery,
      limit,
      offset,
      nameStartWith: searchText,
    };
    const fetchResult = await this.client.query({
      query: StateDefinitionsDocument,
      variables: this.fetchStateDefinitionsQuery,
    });

    const items = Array<StateDefinition>();
    fetchResult.data.adminStateDefinitionQuery?.results.forEach(item => {
      if (item) {
        items.push({
          id: item.id,
          name: item.name,
          isDefault: item.isDefault,
        });
      }
    });
    return {
      items,
      totalCount: fetchResult.data.adminStateDefinitionQuery?.totalCount,
    };
  }

  async getStateDefinition(id: string) {
    const getResult = await this.client.query({
      query: GetStateDefinitionDocument,
      variables: {
        id,
      },
    });

    let data;
    const stateDefinition = getResult.data.stateDefinitionGet;
    if (stateDefinition) {
      data = {
        id: stateDefinition.id,
        name: stateDefinition.name,
        isDefault: stateDefinition.isDefault,
      };
    }
    return {
      data,
    };
  }

  async createStateDefinition(
    name: string,
    isDefault: boolean
  ): Promise<SaveResult<StateDefinition>> {
    const createResult = await this.client.mutate({
      mutation: StateDefinitionCreateDocument,
      variables: {
        name,
        isDefault,
      },
      refetchQueries: [
        {
          query: StateDefinitionsDocument,
          variables: this.fetchStateDefinitionsQuery,
          fetchPolicy: "network-only",
        },
      ],
      awaitRefetchQueries: true,
    });

    const result = createResult.data?.adminStateDefinitionCreate?.result;
    switch (result?.__typename) {
      case "AdminStateDefinitionCreateSuccess": {
        console.log("success", result);
        break;
      }
      case "AdminStateDefinitionCreateProblem": {
        console.log("problem", result);
        const fields: any = {};
        // field validation errors, show specifiic error for each fields
        result.fields?.forEach(f => {
          fields[f.name] = f.message;
        });
        return {
          success: false,
          fields,
          message: result.message,
        };
      }
    }
    return {
      success: true,
    };
  }

  async updateStateDefinition(
    id: string,
    name: string,
    isDefault: boolean
  ): Promise<SaveResult<StateDefinition>> {
    const updateResult = await this.client.mutate({
      mutation: StateDefinitionUpdateDocument,
      variables: {
        id,
        name,
        isDefault,
      },
      refetchQueries: [
        {
          query: StateDefinitionsDocument,
          variables: this.fetchStateDefinitionsQuery,
          fetchPolicy: "network-only",
        },
      ],
      awaitRefetchQueries: true,
      update: (cache, result) => {
        const cacheItem = cache.readQuery({
          query: GetStateDefinitionDocument,
          variables: { id },
        });
        const stateDefinitionCache = cacheItem?.stateDefinitionGet;
        if (stateDefinitionCache) {
          const serverReturnValue =
            result.data?.adminStateDefinitionUpdate?.result;
          if (
            serverReturnValue?.__typename ===
            "AdminStateDefinitionUpdateSuccess"
          ) {
            const newStateDefinitionValue = serverReturnValue.stateDefinition;
            cache.writeQuery({
              query: GetStateDefinitionDocument,
              variables: { id },
              data: {
                __typename: "Query",
                stateDefinitionGet: newStateDefinitionValue,
              },
            });
          }
        }
      },
    });

    const result = updateResult.data?.adminStateDefinitionUpdate?.result;
    switch (result?.__typename) {
      case "AdminStateDefinitionUpdateSuccess": {
        console.log("success", result);
        break;
      }
      case "AdminStateDefinitionUpdateProblem": {
        console.log("problem", result);
        const fields: any = {};
        result.fields?.forEach(f => {
          fields[f.name] = f.message;
        });

        return {
          success: false,
          fields,
          message: result.message,
        };
      }
    }
    return {
      success: true,
    };
  }
  async deleteStateDefinition(id: string) {
    console.log("delete report type", id);
    return { error: "" };
  }
}
