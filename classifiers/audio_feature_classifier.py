import json
from sklearn import preprocessing, svm, metrics
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB

def get_labels_and_features(data):
  labels = []
  audio_features = []
  genre_types = []

  for track in data:
    if track['genre'] not in genre_types:
      genre_types.append(track['genre'])

    labels.append(track['genre'])
    audio_features.append(list(track['audioFeatures'].values()))

  return labels, audio_features, genre_types

def get_labels_and_lyrics(data):
  labels = []
  lyrics = []

  for track in data:
    labels.append(track['Genre'])
    lyrics.append(track['Lyrics'])
  return labels, lyrics

f = open("../spotify-data-fetcher/audio-features.json", "r")
#
audio_features = json.loads(f.read())
#
labels, audio_features, genre_types = get_labels_and_features(audio_features)
#
# # Encode genres
# le = preprocessing.LabelEncoder()
#
# genres_encoded = le.fit_transform(labels)
#
# # Split Data
# X_train, X_test, y_train, y_test = train_test_split(audio_features, genres_encoded, test_size=0.3)
#
# # Train
# clf = svm.SVC(decision_function_shape='ovo') # One vs One Multi-class
#
# clf.fit(X_train, y_train)
#
# # Predict
# y_pred = clf.predict(X_test)
#
# # Get stats
# print(genre_types)
# print(metrics.classification_report(y_test, y_pred))

b = open("../genius-scraper/bag_of_words.json", "r")
bag_of_words_data = json.loads(b.read())
labels, lyrics = get_labels_and_lyrics(bag_of_words_data)

print(lyrics[0])


count_vect = CountVectorizer()
tfidf_transformer = TfidfTransformer()
X_train_counts = count_vect.fit_transform(lyrics[:1])
X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)

# Encode genres
le = preprocessing.LabelEncoder()

genres_encoded = le.fit_transform(labels)
X_train, X_test, y_train, y_test = train_test_split(X_train_tfidf, genres_encoded, test_size=0.3)

clf = MultinomialNB().fit(lyrics, labels)
clf.fit(X_train, y_train)

# Predict
y_pred = clf.predict(X_test)

# Get stats
print(genre_types)
print(metrics.classification_report(y_test, y_pred))