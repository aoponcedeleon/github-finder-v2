import {Avatar, Badge, Box, Button, Card, Container, createStyles, Group, Paper, SimpleGrid, Text, ThemeIcon, Title} from '@mantine/core';
import {IconArrowNarrowLeft, IconBrandGithub, IconBriefcase, IconMapPin} from '@tabler/icons';
import axios from 'axios';
import {useRouter} from 'next/router'
import React from 'react'
import ReposCard from '../../components/ReposCard';

export const fetchConfig = {
    headers: {
        authorization: `${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
    }
}

const useStyles = createStyles((theme) => ({
    avatar: {
        border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white}`
    }
}))

const UserPage = () => {
    const router = useRouter();
    const username = router.query.username;
    const [userObject, setUserObject] = React.useState({username: '', id: '', avatar_url: '', name: '', hireable: false, bio: '', location: '', public_repos: 0, public_gists: 0, followers: 0, following: 0, html_url: '', company: ''});
    const [repos, setRepos] = React.useState<any[]>([]);
    const {classes} = useStyles();

    React.useEffect(() => {
        async function fetchData() {
            if (username !== undefined) {
                const response: any = await axios.get(`https://api.github.com/users/${username}`, fetchConfig);
                const user: any = response.data;
                setUserObject({
                    username: user.login,
                    id: user.id,
                    avatar_url: user.avatar_url,
                    name: user.name,
                    hireable: user.hireable,
                    bio: user.bio,
                    location: user.location,
                    followers: user.followers,
                    following: user.following,
                    public_repos: user.public_repos,
                    public_gists: user.public_gists,
                    html_url: user.html_url,
                    company: user.company
                })
            }
        }

        fetchData();
    }, [username]);


    React.useEffect(() => {
        async function onUserLoadGetRepos() {
            const response: any = await axios.get(`https://api.github.com/users/${userObject.username}/repos?sort=pushed`, fetchConfig);
            const repos: any = response.data;
            const sorted = repos.sort(function (x: any, y: any) {
                return x.updated_at - y.updated_at
            })
            setRepos(sorted);
        }

        if (userObject.username.length > 0) {
            onUserLoadGetRepos();
        }
    }, [userObject]);



    return (
        <Container size="xl" mt="lg">
            <Button leftIcon={<IconArrowNarrowLeft />} variant="subtle" color="teal" mb="lg" onClick={() => {
                router.push('/');
            }}>
                Back to Search Page
            </Button>
            <Card radius={20} withBorder shadow="xl">
                <Card.Section p="xl">
                    <Avatar size={200} radius={50} src={userObject.avatar_url} mb={16} className={classes.avatar} />
                    <Title order={1}>{userObject.name}</Title>
                    <Group spacing={12}>
                        <Text color="dimmed">{userObject.username}</Text>
                        {
                            userObject.location &&
                            <Group spacing={5}>
                                <IconMapPin size={15} />
                                <Text color="dimmed">{userObject.location}</Text>
                            </Group>
                        }
                        {
                            userObject.company &&
                            <Group spacing={5}>
                                <IconBriefcase size={15} />
                                <Text color="dimmed">{userObject.company}</Text>
                            </Group>
                        }
                    </Group>
                    <Text mt={5}>{userObject.bio}</Text>
                    <Box mt="md">
                        <Badge size="lg" color={userObject.hireable ? "teal" : "gray"} mr={8}>
                            {userObject.hireable ? "Open to Hiring" : "Not Open to Hiring"}
                        </Badge>
                        <Badge size="lg" color="blue" mr={8} mb={8}>
                            Followers: {userObject.followers}
                        </Badge>
                        <Badge size="lg" color="cyan" mr={8} mb={8}>
                            Following: {userObject.following}
                        </Badge>
                        <Badge size="lg" color="violet" mr={8} mb={8}>
                            Public Repos: {userObject.public_repos}
                        </Badge>
                        <Badge size="lg" color="grape" mr={8} mb={8}>
                            Public Gists: {userObject.public_gists}
                        </Badge>
                    </Box>
                </Card.Section>
                <Card.Section p="xl" withBorder>
                    {/* <Button leftIcon={<IconBrandGithub />} variant="subtle" color="teal" component='a' href={userObject.html_url}>View Github Profile</Button> */}
                    <SimpleGrid cols={3}>
                        {repos && repos.map((repo, index) => {
                            return (
                                <div key={index}>
                                    <ReposCard repoObject={repo} />
                                </div>
                            )
                        })}
                    </SimpleGrid>
                </Card.Section>
            </Card>
        </Container>
    )
}

export default UserPage
