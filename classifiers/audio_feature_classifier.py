import json
from sklearn import preprocessing, svm, metrics
from sklearn.model_selection import train_test_split

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

f = open("../spotify-data-fetcher/audio-features.json", "r")

audio_features = json.loads(f.read())

labels, audio_features, genre_types = get_labels_and_features(audio_features)

# Encode genres
le = preprocessing.LabelEncoder()

genres_encoded = le.fit_transform(labels)

# Split Data
X_train, X_test, y_train, y_test = train_test_split(audio_features, genres_encoded, test_size=0.3)

# Train
clf = svm.SVC(decision_function_shape='ovo') # One vs One Multi-class

clf.fit(X_train, y_train)

# Predict
y_pred = clf.predict(X_test)

# Get stats
print(genre_types)
print(metrics.classification_report(y_test, y_pred))
