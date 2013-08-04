package remixlab.tersehandling.generic.agent;

import remixlab.tersehandling.core.*;
import remixlab.tersehandling.event.*;
import remixlab.tersehandling.generic.event.*;
import remixlab.tersehandling.generic.profile.*;

public class GenericWheeledMotionAgent<W extends GenericMotionProfile<?>,
									   M extends GenericMotionProfile<?>,
									   C extends GenericClickProfile<?>> extends GenericMotionAgent<M,C> {
	
	protected W wheelProfile;
	
	public GenericWheeledMotionAgent(W w, M p, C c, TerseHandler scn, String n) {
		super(p, c, scn, n);
		wheelProfile = w;
	}
	
	public W wheelProfile() {
		return wheelProfile;
	}
	
	public void setWheelProfile(W profile) {
		wheelProfile = profile;
	}
	
	@Override
	public String info() {
		String description = new String();
		description += name();
		description += "\n";
		if( clickProfile().bindingsDescription().length() != 0 ) {
			description += "Click shortcuts\n";
			description += clickProfile().bindingsDescription();
		}
		if( motionProfile().bindingsDescription().length() != 0 ) {
			description += "Motion shortcuts\n";
			description += motionProfile().bindingsDescription();
		}
		if( wheelProfile().bindingsDescription().length() != 0 ) {
			description += "Wheel shortcuts\n";
			description += wheelProfile().bindingsDescription();
		}
		return description;
	}
	
	@Override
	public void handle(TerseEvent event) {
		//overkill but feels safer ;)
		if(event == null || !handler.isAgentRegistered(this) || grabber() == null) return;		
		if(event instanceof Duoable<?>) {
			if(event instanceof ClickEvent)
				if( foreignGrabber() )
					handler.enqueueEventTuple(new EventGrabberTuple(event, grabber()));
				else
					handler.enqueueEventTuple(new EventGrabberDuobleTuple(event, clickProfile().handle((Duoable<?>)event), grabber()));
			else
				if(event instanceof MotionEvent) {
					((MotionEvent)event).modulate(sens);
					if( foreignGrabber() )
						handler.enqueueEventTuple(new EventGrabberTuple(event, grabber()));
					else
						if( event instanceof GenericDOF1Event )
							handler.enqueueEventTuple(new EventGrabberDuobleTuple(event, wheelProfile().handle((Duoable<?>)event), grabber()));
						else
							handler.enqueueEventTuple(new EventGrabberDuobleTuple(event, motionProfile().handle((Duoable<?>)event), grabber()));			
			}
		}
	}
}
