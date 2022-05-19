![image](https://user-images.githubusercontent.com/32162305/150810942-99672aac-99af-47ea-849b-ba263fae0c3f.png)

---

**Deep Learning**

**Dozent: Prof. Dr. Felix Gers (Berliner Hochschule für Technik)**

**Studiengang Medieninformatik Online MA, Sommersemester 2022**

**University of Applied Sciences Emden/Leer, Faculty of Technology, Department of Electrical Engineering and Informatics**

---

### Einsendeaufgabe EA2 : Erstellung einer Webanwendung zur Simulation und Visualisierung eines Netzwerkes mit Spiking Neurons.

[zur Webseite](https://deep-learning.ckitte.de/ea2/)

## Umsetzung

Die hier vorgestellte Umsetzung der Aufgabenstellung teilt sich in zwei einzelne Lösungen. Bei der ersten Lösung handelt es  sich um eine konfigurierbare Simulation zweier verbundener LIF Neuronen. Die zweite Lösung beinhaltet eine Simulation zum Verhalten des LIF Neurons innerhalb eines größeren Netzwerkes. Der gesamte Source Code ist frei auf [GitHub](https://github.com/ChristianKitte/DeepLearningSpikingNeurons) verfügbar. Daher wird an dieser Stelle nicht zu tief auf den Code eingegangen.

## Leaky Integrate and Fire (LIF) Neuron

Ein **Leaky Integrate and Fire (LIF) Neuron** zeichnet sich grundlegend dadurch aus, dass mit zunehmenden Signaleingang ein Spannungspotential aufgebaut wird. Wird eine bestimmte Grenzspannung (**Threshold**) überschritten, so kommt es seinerseits ebenfalls zu einer Entladung in Form eines Impulses (**Spike**). Das im Neuron vorhandene Potential bricht zusammen und nach einer Erholungsphase beginnt der Vorgang von neuen. Es gleicht hierbei sehr dem Verhalten menschlicher Neuronen im Gehirn.

Das hier verwendete Modell basiert ursprünglich vom Konzept her auf die [hier]([Leaky Integrate and Fire neuron with Tensorflow](http://www.kaizou.org/2018/07/lif-neuron-tensorflow.html)) zu findende Modellierung von **David Corvoysier** aus dem Jahr 2018. Es basiert auf der Modellierung biologischer Neuronen als vereinfachte **RC-Schaltung**. Hierdurch kann sie mit etablierten Formeln berechnet werden.

Das mit Hilfe von Tensor Flow umgesetzte Modell wurde hierfür in JavaScript neu implementiert und als Klasse **LIFNeuron** in dieser Anwendung verwendet. Insbesondere wurden die Algorithmen zur Berechnung der Spannungen und Ströme übernommen. Ein Vergleich der im Lauf produzierten Daten beider Umsetzungen konnte die korrekte Implementierung zeigen.

Zur **Vereinfachung** wurden sowohl die **Zeitspanne zwischen zwei Spikes** als auch deren **Vorgängerspikes** in der Modellierung nicht berücksichtigt. Zudem wurde die **Höhe eines Spike** gleich dem Threshold gesetzt und **dessen Länge** auf einen Berechnungsschritt. Innerhalb dieser Lösung wird bei der Berechnung mit einer **einheitlichen Schrittlänge** von einer Millisekunde gerechnet. Grundsätzlich wird zudem von **idealen Impulsen** ausgegangen, deren Kanten ideal und nicht abgeflacht sind. Innerhalb der Ausgaben kann gleichwohl der Eindruck erweckt werden, als wenn dies nicht so sei.

Im Kern besteht das so umgesetzte Modell lediglich aus drei grundlegenden Funktionen, welche durch eine zentrale Logik in der Funktion **get_potential_op** aufgerufen werden: 

- **get_integrating_op**: Generiert durch den Stromfluss einen Anstieg des Potentials

- **get_firing_op**: Generiert einen Spike, sofern der Grenzwert überschritten wird

- **get_resting_op**: Generiert eine Phase zur Regeneration

Für den zweiten Teil der Lösung wurde die Klasse **SynapticLIFNeuron** Neuron in die Anwendung eingeführt. Sie basiert auf der vorherigen Klasse, unterstützt jedoch als wichtigste Erweiterung **beliebig viele Signaleingänge** sowie zusätzliche Funktionalität zur Ausgabe ihres Status.

## Connection

Neuronen innerhalb eines Netzwerkes müssen verbunden werden. Die Klasse **Connection** bietet diese Funktionalität und ist in erster Linie die Beschreibung zwei **SynapticLIFNeuronen** als zusammen gehörend.  Sie repräsentiert somit die Dendriten und Axone biologischer Neuronen im Gehirn.

Verbindungen zwischen Neuronen in biologischen Systemen sind **unterschiedlich stark** ausgebildet. In künstlichen Systemen wie beispielsweise einem Perzeptron geschieht dies durch die Wichtung der an den Eingänge anliegenden, numerischen Werte. 

Dies ist hier nicht so einfach möglich. Ein **LIFNeuron** funktioniert durch die Simulation eines Stromflusses, was zur Emittierung von Spikes führt. Ein wichtiger Punkt der hier gezeigten Lösung ist daher die Transformation eines **ausgehenden Spikes (Potential)** zu einem **eingehenden Strom**. Dies leistet die Klasse Connection durch das Hinzufügen eines Widerstandes. Der Widerstand kann als **Qualität der Verbindung** zweier LIFNeuronen interpretiert werden:

- **Hoher Widerstand**: Die Verbindung ist schlecht. Selbst ein hohe Spannung führt nur zu einem kleinen Strom.

- **Kleiner Widerstand**: Die Verbindung ist gut. Selbst eine kleine Spannung führt bereits zu einem Stromfluss. Größere Spannungen verursachen größere Ströme.

Die Höhe der durch die Verbindung fließenden Stroms errechnet sich hierbei durch das Ohm' sche Gesetz. Innerhalb dieser Anwendung wird der Widerstandswert entweder fest (Lösung 1) oder zufällig (Lösung 2) eingestellt. Im zweiten Fall wird aus dem vorgegebenen Bereich ein zufälliger Wert gewählt.

## Lösung 1

Bei der ersten Lösung steht die Simulation eines einzelnen LIF Neurons sowie zweier in Reihe geschalteter Neuronen im Vordergrund. 

Hierbei erhält das erste Neuron einen **konfigurierbaren Eingangsstrom**, welcher für die in das Neuron eintreffenden Ströme steht. Der Ausgang des Neurons ist wiederum mit dem Eingang des zweiten Neurons über eine Connection verbunden. Die **Spikes des ersten Neurons** generieren somit einen **Stromfluss in das zweite Neuron**. Die Höhe ist hierbei vom einstellbaren Widerstand der Connection abhängig.

Grundsätzlich kann zwischen einer **getakteten Stromquelle** sowie einer **zufälligen Stromkurve** gewählt werden. Insbesondere die erste Art stellt hierbei das Äquivalent zu einem **Spike Train** dar. 

Auf der rechten Seite werden im **oberen Graph** der Strom, der Spannungsverlauf sowie die Spikes des Neurons angezeigt. Wie oben beschrieben richtet sich die Dauer der Ruhezeit nach den zugrundeliegenden Zeitschritten, hier eine Millisekunde. Der **untere Graph** zeigt des Status des zweiten Neurons.

Die Simulation der Lösung 1 durchläuft bei jeder Änderung die **gesamte Simulation** von maximal 200 ms und bringt diese neu zur Darstellung.

## Lösung 2

Die zweite Lösung bietet die Simulation eines Netzwerk aus LIF Neuronen. Im Gegensatz zur ersten Lösung läuft die Simulierung nach ihren Start für eine unbestimmte Zeit fort, kann aber auch pausiert oder abgebrochen werden. Änderungen an den Einstellungen werden zu Beginn jedes neuen Berechnungsschrittes berücksichtigt.

Als Netzwerk wird ein Ball gewählt, wobei jedes Neuron mit jedem anderen Neuron verbunden ist. Die Stärke der Verbindungen wird hierbei zufällig festgelegt. Grundsätzlich kann auch hier zwischen einer getakteten Stromquelle sowie einer zufälligen Stromkurve gewählt werden.

Eine Änderungen an der Anzahl der zugrunde liegenden Neuronen oder des Widerstandsbereichs führen zu der Erzeugung eines neuen Graphen mit neuen Widerstandswerten der Verbindungen. Änderungen der anderen Werte werden lediglich berücksichtigt, ohne den Graphen neu zu erzeugen. 

Auf der rechten Seite werden verschiedene Ausgaben zur Netzaktivität ausgegeben. Als erstes erfolgt für jedes Neuron eine eigene Visualisierung als abgerundete Box. Bei laufender Simulation erscheinen die beteiligten Neuronen grün, rot im Falle eines Spikes.





Ganz oben werden die LIF Neuronen visualisiert, darunter die Anzahl der Spikes je Milisekunde. Der Graph bleibt bei der Beendigung weiterhin verfügbar und kann so ausgewertet werden. Als letztes wird der Graph selbst visuell ausgegeben. Nodes stellen die LIF Neuronen dar, die Kanten die mit einem Widerstand belasteten Verbindungen. Als Netzstruktur wurde ein Ball gewählt, so dass jedes Neuron mit jedem anderen verbunden ist. Die Dauer der zugrunde gelegten Spikes richten sich hierbei vereinfacht nach der Dauer der Ruhezeit und sind fest vorgegeben.
