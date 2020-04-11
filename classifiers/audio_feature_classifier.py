import json
from sklearn import preprocessing, svm, metrics
from sklearn.model_selection import train_test_split

def get_labels_and_features(data):
  labels = []
  audio_features = []

  for track in data:
    labels.append(track['genre'])
    audio_features.append(list(track['audioFeatures'].values()))

  return labels, audio_features

f = open("../spotify-data-fetcher/audio-features.json", "r")

audio_features = json.loads(f.read())

labels, audio_features = get_labels_and_features(audio_features)

# Encode genres
le = preprocessing.LabelEncoder()

genres_encoded =  le.fit_transform(labels)

# Split Data
X_train, X_test, y_train, y_test = train_test_split(audio_features, genres_encoded, test_size=0.3)

# Train
clf = svm.SVC(decision_function_shape='ovo') # One vs One Multi-class

clf.fit(X_train, y_train)

# Predict
y_pred = clf.predict(X_test)

# Get accuracy
print("Accuracy:",metrics.accuracy_score(y_test, y_pred))
