import React, { useState, useEffect } from 'react';
import api from './services/api';

import { SafeAreaView, View, FlatList, Text, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';

export default function App() {
	
	const [repositories, setRepositories] = useState([]);

	useEffect(() => {
		api.get('/repositories').then(response => {
			setRepositories(response.data);
		});
	}, []);

	async function handleDeleteRepository(id) {
		await api.delete(`repositories/${id}`);

		const newRepository = repositories.filter(
			repository => repository.id !== id
		);
		setRepositories(newRepository);
	}

	async function handleLikeRepository(id) {
		await api.post(`repositories/${id}/like`).then(response => {
			const repositoryLiked = response.data;
			const repositoryLikedIndex = repositories.findIndex(
				repository => repository.id === id
			);
			repositories[repositoryLikedIndex] = repositoryLiked;
			setRepositories([...repositories]);
		});
	}

	async function handleAddProject() {
		const response = await api.post('/repositories', {
			title: `Repository: #${Date.now()}`,
			url: 'http://...',
			techs: ['NodeJS'],
		});

		const newRepository = response.data;

		setRepositories([...repositories, newRepository]);
	}

	return (
		<>
			<StatusBar barStyle='light-content' backgroundColor='#7159c1' />
			<SafeAreaView style={styles.container}>
				<FlatList
					data={repositories}
					key={repository => repository.id}
					renderItem={({ item: repository }) => {
						return (
							<>
							<View style={styles.repositoryContainer}>
								<View style={styles.header}>
									<Text style={styles.repository}>{repository.title}</Text>

									<TouchableOpacity
										style={styles.buttonDelete}
										activeOpacity={0.6}
										onPress={() => handleDeleteRepository(repository.id)}
									>
										<Text style={styles.buttonDeleteText}>X</Text>
									</TouchableOpacity>
								</View>

								<View style={styles.techsContainer}>
									{repository.techs.map(tech => (
										<Text key={tech} style={styles.tech}>
											{tech}
										</Text>
										))}
								</View>

								<View style={styles.likesContainer}>
									<Text
										style={styles.likeText}
											// Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
											testID={`repository-likes-${repository.id}`}
									>
										{`${repository.likes} likes`}
									</Text>
								</View>

								<TouchableOpacity
									activeOpacity={0.6}
									style={styles.button}
									onPress={() => handleLikeRepository(repository.id)}
								// Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
									testID={`like-button-${repository.id}`}
								>
									<Text style={styles.buttonText}>Curtir</Text>
								</TouchableOpacity>
							</View>
							</>
						);
					}}
				/>
				<TouchableOpacity
					style={styles.buttonAdd}
					activeOpacity={0.6}
					onPress={handleAddProject}
				>
					<Text style={styles.buttonAddText}>Adicionar projeto</Text>
				</TouchableOpacity>
			</SafeAreaView>
		</>
	);
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
