import { useQuery } from '@apollo/client';
import { gql } from '../../__generated__/gql';

const getUserInfoQuery = gql(/* GraphQL */ `
  query GetUserInfo {
    me {
      id
      dni
      roles
      is_admin
      can_publish_services
    }
  }
`);

const useLoggedInUserInfoFetch = () => {
  const { error, data, loading } = useQuery(getUserInfoQuery, {
    onError: error => {
      console.log(JSON.stringify(error));
    },
  });

  return { data, error, loading };
};

export default useLoggedInUserInfoFetch;
