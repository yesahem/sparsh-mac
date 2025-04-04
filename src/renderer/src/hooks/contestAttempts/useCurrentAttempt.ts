import { UseQueryOptions, useQuery } from 'react-query';
import createAxiosClient from '../../utils/axiosClient';
import TContestAttempt from '../../types/TContestAttempt';
import IApiResponse from '../../types/IApiResponse';

const client = createAxiosClient();

type Data = {
	attributes: Pick<TContestAttempt, 'id' | 'end-time' | 'start-time'>;
	relationships: {
		contest: {
			data: {
				id: string;
			};
		};
		user: {
			data: {
				id: string | number;
			};
		};
	};
};

async function queryFn({ queryKey }: { queryKey: any }) {
	const [_, $, contest_id] = queryKey;
	const response = await client.get<IApiResponse<Data | null>>(
		`/contest-attempts/current-attempt?contest_id=${contest_id}`
	);
    console.log('res',response)
	if (response.data.data === null) return response.data.data;
	return {
		...response.data.data.attributes,
		contest: response.data.data.relationships.contest.data,
		user: response.data.data.relationships.user.data,
	} as TContestAttempt;
}

export default function useCurrentContestAttempt(
	contest_id: string,
	options: UseQueryOptions<
		TContestAttempt | null,
		unknown,
		TContestAttempt | null
	> = {}
) {
	return useQuery({
		queryKey: ['contest-attempt', 'current-attempt', contest_id],
		queryFn,
		...options,
	});
}
